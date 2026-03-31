import type { GetReflectionHomeUseCase } from "@harness/application";
import type { ApiHandler } from "../../../http/router";
import { createJsonResponse } from "../../../http/response";

export const createGetReflectionHomeHandler = (
  getReflectionHome: GetReflectionHomeUseCase
): ApiHandler => {
  return (request, context) => {
    return createJsonResponse(getReflectionHome.execute(), request, context.config, { status: 200 });
  };
};
