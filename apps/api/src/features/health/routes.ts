import { createGetHealthStatusUseCase } from "@harness/application";
import { createStaticHealthStatusRepository } from "@harness/infrastructure";
import type { RouteDefinition } from "../../http/router";
import { createGetHealthHandler } from "./handlers/get-health-handler";

const getHealthHandler = createGetHealthHandler(
  createGetHealthStatusUseCase(
    createStaticHealthStatusRepository({
      service: "harness-api",
      version: "0.1.0"
    })
  )
);

export const healthRoutes: RouteDefinition[] = [
  {
    method: "GET",
    path: "/health",
    handler: getHealthHandler
  }
];
