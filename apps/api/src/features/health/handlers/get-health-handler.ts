import type { GetHealthStatusUseCase } from "@harness/application";
import type { ApiHandler } from "../../../http/router";
import { createJsonResponse } from "../../../http/response";

export const createGetHealthHandler = (getHealthStatus: GetHealthStatusUseCase): ApiHandler => {
  return (request, context) => {
    return createJsonResponse(getHealthStatus.execute(), request, context.config, { status: 200 });
  };
};
