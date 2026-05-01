import { AuthUnauthorizedError, AuthValidationError } from "@harness/application";
import { createJsonResponse } from "../../http/response";
import type { ApiHandlerContext } from "../../http/router";
import { OAuthConfigurationError, OAuthProviderError } from "./oauth-providers";
import { DatabaseBindingMissingError } from "./repositories";

export const createAuthErrorResponse = (request: Request, context: ApiHandlerContext, error: unknown) => {
  if (error instanceof AuthUnauthorizedError) {
    return createJsonResponse({ message: error.message }, request, context.config, { status: 401 });
  }

  if (error instanceof AuthValidationError) {
    return createJsonResponse({ message: error.message }, request, context.config, { status: 400 });
  }

  if (error instanceof OAuthConfigurationError) {
    return createJsonResponse({ message: error.message }, request, context.config, { status: 503 });
  }

  if (error instanceof OAuthProviderError) {
    return createJsonResponse({ message: error.message }, request, context.config, { status: 502 });
  }

  if (error instanceof DatabaseBindingMissingError) {
    return createJsonResponse({ message: error.message }, request, context.config, { status: 503 });
  }

  throw error;
};
