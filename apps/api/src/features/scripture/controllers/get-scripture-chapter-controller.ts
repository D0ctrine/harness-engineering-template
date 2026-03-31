import { createJsonResponse } from "../../../http/response";
import type { ApiHandler } from "../../../http/router";
import { createScriptureQueryService, ScriptureServiceError } from "../services/create-scripture-query-service";

export const createGetScriptureChapterController = (): ApiHandler => {
  return async (request, context) => {
    const service = createScriptureQueryService(context.bindings, context.config);
    const url = new URL(request.url);

    try {
      const chapter = await service.getChapter({
        versionId: url.searchParams.get("versionId"),
        bookId: url.searchParams.get("bookId"),
        chapter: url.searchParams.get("chapter")
      });

      return createJsonResponse(chapter, request, context.config, { status: 200 });
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
