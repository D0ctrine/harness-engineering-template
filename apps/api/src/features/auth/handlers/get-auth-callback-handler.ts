import { createJsonResponse } from "../../../http/response";
import type { ApiHandler } from "../../../http/router";
import { createAuthErrorResponse } from "../auth-errors";
import { fetchSsoIdentity, getProviderSettings, isAuthProvider } from "../oauth-providers";
import { createRedirectResponse, toWebAppUrl } from "../redirect";
import { createUserRepository } from "../repositories";
import {
  appendAuthCleanupCookies,
  appendOAuthStateCleanupCookie,
  appendPendingSignupCookie,
  appendSessionCookie,
  readOAuthStateToken
} from "../session";

export const createGetAuthCallbackHandler = (): ApiHandler => {
  return async (request, context) => {
    try {
      const url = new URL(request.url);
      const code = url.searchParams.get("code");
      const provider = url.searchParams.get("provider");
      const state = url.searchParams.get("state");
      const stateToken = await readOAuthStateToken(request, context.config);

      if (!code || !state || !stateToken || stateToken.state !== state) {
        return createJsonResponse({ message: "OAuth callback state가 유효하지 않습니다." }, request, context.config, {
          status: 400
        });
      }

      if (provider && (!isAuthProvider(provider) || provider !== stateToken.provider)) {
        return createJsonResponse({ message: "OAuth provider가 유효하지 않습니다." }, request, context.config, {
          status: 400
        });
      }

      const settings = getProviderSettings(stateToken.provider, context.config);
      const identity = await fetchSsoIdentity(settings, context.config, code);
      const repository = createUserRepository(context.bindings.DB);
      const user = await repository.findUserByProvider(identity.provider, identity.providerId);
      const headers = new Headers();

      if (user) {
        appendAuthCleanupCookies(headers);
        await appendSessionCookie(headers, request, context.config, {
          sub: user.id,
          provider: user.provider,
          providerId: user.providerId
        });
      } else {
        appendOAuthStateCleanupCookie(headers);
        await appendPendingSignupCookie(headers, request, context.config, identity);
      }

      return createRedirectResponse(toWebAppUrl(stateToken.returnTo, context.config), headers);
    } catch (error) {
      return createAuthErrorResponse(request, context, error);
    }
  };
};
