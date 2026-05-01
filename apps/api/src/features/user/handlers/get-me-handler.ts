import { createGetCurrentAuthUserUseCase } from "@harness/application";
import { toAuthenticatedUser } from "@harness/shared";
import { createJsonResponse } from "../../../http/response";
import type { ApiHandler } from "../../../http/router";
import { createAuthErrorResponse } from "../../auth/auth-errors";
import { createUserRepository } from "../../auth/repositories";
import { readPendingSignupToken, readSessionToken } from "../../auth/session";

export const createGetMeHandler = (): ApiHandler => {
  return async (request, context) => {
    try {
      const session = await readSessionToken(request, context.config);
      const pendingIdentity = await readPendingSignupToken(request, context.config);

      if (!session && !pendingIdentity) {
        return createJsonResponse(
          {
            isAuthenticated: false,
            requiresOnboarding: false,
            user: null,
            pendingProfile: null
          },
          request,
          context.config,
          { status: 200 }
        );
      }

      if (!session && pendingIdentity) {
        return createJsonResponse(
          {
            isAuthenticated: true,
            requiresOnboarding: true,
            user: null,
            pendingProfile: {
              provider: pendingIdentity.provider,
              name: pendingIdentity.name,
              age: pendingIdentity.age
            }
          },
          request,
          context.config,
          { status: 200 }
        );
      }

      const result = await createGetCurrentAuthUserUseCase(createUserRepository(context.bindings.DB)).execute({
        sessionUserId: session?.sub,
        pendingIdentity
      });

      return createJsonResponse(
        {
          isAuthenticated: result.isAuthenticated,
          requiresOnboarding: result.requiresOnboarding,
          user: result.user ? toAuthenticatedUser(result.user) : null,
          pendingProfile: result.pendingIdentity
            ? {
                provider: result.pendingIdentity.provider,
                name: result.pendingIdentity.name,
                age: result.pendingIdentity.age
              }
            : null
        },
        request,
        context.config,
        { status: 200 }
      );
    } catch (error) {
      return createAuthErrorResponse(request, context, error);
    }
  };
};
