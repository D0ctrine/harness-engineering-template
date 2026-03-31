import type { GetReadingHomeUseCase } from "@harness/application";
import type { ApiHandler } from "../../../http/router";
import { createJsonResponse } from "../../../http/response";

export const createGetReadingHomeHandler = (getReadingHome: GetReadingHomeUseCase): ApiHandler => {
  return (request, context) => {
    return createJsonResponse(getReadingHome.execute(), request, context.config, { status: 200 });
  };
};
