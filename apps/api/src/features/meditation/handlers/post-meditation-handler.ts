import { AuthUnauthorizedError, createSaveMeditationUseCase } from "@harness/application";
import type { MeditationSaveRequest } from "@harness/shared";
import { createJsonResponse } from "../../../http/response";
import type { ApiHandler } from "../../../http/router";
import { createAuthErrorResponse } from "../../auth/auth-errors";
import { createMeditationRepository } from "../../auth/repositories";
import { readSessionToken } from "../../auth/session";

const readMeditationSaveRequest = async (request: Request): Promise<MeditationSaveRequest> => {
  return request.json() as Promise<MeditationSaveRequest>;
};

export const createPostMeditationHandler = (): ApiHandler => {
  return async (request, context) => {
    try {
      const session = await readSessionToken(request, context.config);

      if (!session) {
        throw new AuthUnauthorizedError();
      }

      const input = await readMeditationSaveRequest(request);
      const meditation = await createSaveMeditationUseCase(
        createMeditationRepository(context.bindings.DB)
      ).execute({
        userId: session.sub,
        content: input.content,
        date: input.date
      });

      return createJsonResponse({ meditation }, request, context.config, { status: 201 });
    } catch (error) {
      return createAuthErrorResponse(request, context, error);
    }
  };
};
