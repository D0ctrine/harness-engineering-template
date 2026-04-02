import { createJsonResponse } from "../../../http/response";
import type { ApiHandler } from "../../../http/router";
import { createScriptureQueryService, ScriptureServiceError } from "../services/create-scripture-query-service";

export const createGetScriptureBooksController = (): ApiHandler => {
  return async (request, context) => {
    const service = createScriptureQueryService(context.bindings, context.config, request);
    const url = new URL(request.url);

    try {
      const books = await service.getBooks(url.searchParams.get("versionId"));
      return createJsonResponse(books, request, context.config, { status: 200 });
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
