import type { ApiHandler } from "../../../http/router";
import { appendOAuthStateCookie } from "../session";
import { createAuthorizationUrl, getProviderSettings, isAuthProvider } from "../oauth-providers";
import { createAuthErrorResponse } from "../auth-errors";
import { createRedirectResponse, resolveSafeReturnTo } from "../redirect";
import { createJsonResponse } from "../../../http/response";

export const createGetAuthLoginHandler = (): ApiHandler => {
  return async (request, context) => {
    try {
      const url = new URL(request.url);
      const provider = url.searchParams.get("provider");

      if (!isAuthProvider(provider)) {
        return createJsonResponse({ message: "지원하지 않는 로그인 provider입니다." }, request, context.config, {
          status: 400
        });
      }

      const state = crypto.randomUUID();
      const returnTo = resolveSafeReturnTo(url.searchParams.get("returnTo"), context.config);
      const settings = getProviderSettings(provider, context.config);
      const headers = new Headers();

      await appendOAuthStateCookie(headers, request, context.config, {
        provider,
        state,
        returnTo
      });

      return createRedirectResponse(createAuthorizationUrl(settings, context.config, state), headers);
    } catch (error) {
      return createAuthErrorResponse(request, context, error);
    }
  };
};
