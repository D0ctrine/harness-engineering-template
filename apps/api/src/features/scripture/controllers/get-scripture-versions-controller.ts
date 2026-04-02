import { createJsonResponse } from "../../../http/response";
import type { ApiHandler } from "../../../http/router";
import { createScriptureQueryService, ScriptureServiceError } from "../services/create-scripture-query-service";

export const createGetScriptureVersionsController = (): ApiHandler => {
  return async (request, context) => {
    const service = createScriptureQueryService(context.bindings, context.config, request);

    try {
      const versions = await service.getVersions();
      return createJsonResponse(versions, request, context.config, { status: 200 });
    } catch (error) {
      if (error instanceof ScriptureServiceError) {
        return createJsonResponse({ message: error.message }, request, context.config, {
          status: error.status
        });
      }

      throw error;
    }
  };
};
