import { createCompleteSignupUseCase } from "@harness/application";
import { toAuthenticatedUser, type SignupRequest } from "@harness/shared";
import { createJsonResponse } from "../../../http/response";
import type { ApiHandler } from "../../../http/router";
import { createAuthErrorResponse } from "../../auth/auth-errors";
import { createUserRepository } from "../../auth/repositories";
import {
  appendPendingSignupCleanupCookie,
  appendSessionCookie,
  readPendingSignupToken
} from "../../auth/session";

const readSignupRequest = async (request: Request): Promise<SignupRequest> => {
  return request.json() as Promise<SignupRequest>;
};

export const createPostSignupHandler = (): ApiHandler => {
  return async (request, context) => {
    try {
      const identity = await readPendingSignupToken(request, context.config);

      if (!identity) {
        return createJsonResponse({ message: "온보딩 가능한 로그인 세션이 없습니다." }, request, context.config, {
          status: 401
        });
      }

      const profile = await readSignupRequest(request);
      const user = await createCompleteSignupUseCase(createUserRepository(context.bindings.DB)).execute({
        identity,
        profile
      });
      const headers = new Headers();

      appendPendingSignupCleanupCookie(headers);
      await appendSessionCookie(headers, request, context.config, {
        sub: user.id,
        provider: user.provider,
        providerId: user.providerId
      });

      return createJsonResponse({ user: toAuthenticatedUser(user) }, request, context.config, {
        status: 201,
        headers
      });
    } catch (error) {
      return createAuthErrorResponse(request, context, error);
    }
  };
};
