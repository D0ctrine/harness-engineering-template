import type { GetReadingNoteWorkspaceUseCase } from "@harness/application";
import type { ApiHandler } from "../../../http/router";
import { createJsonResponse } from "../../../http/response";

export const createGetReadingNoteWorkspaceHandler = (
  getReadingNoteWorkspace: GetReadingNoteWorkspaceUseCase
): ApiHandler => {
  return (request, context) => {
    return createJsonResponse(getReadingNoteWorkspace.execute(), request, context.config, { status: 200 });
  };
};
