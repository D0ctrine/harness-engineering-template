import type { GetCommunityPreviewUseCase } from "@harness/application";
import type { ApiHandler } from "../../../http/router";
import { createJsonResponse } from "../../../http/response";

export const createGetCommunityPreviewHandler = (
  getCommunityPreview: GetCommunityPreviewUseCase
): ApiHandler => {
  return (request, context) => {
    return createJsonResponse(getCommunityPreview.execute(), request, context.config, { status: 200 });
  };
};
