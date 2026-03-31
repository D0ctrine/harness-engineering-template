import { createGetReflectionHomeUseCase } from "@harness/application";
import { createPreloadedReflectionHomeRepository } from "@harness/infrastructure";
import type { RouteDefinition } from "../../http/router";
import { createGetReflectionHomeHandler } from "./handlers/get-reflection-home-handler";

const getReflectionHomeHandler = createGetReflectionHomeHandler(
  createGetReflectionHomeUseCase(createPreloadedReflectionHomeRepository())
);

export const reflectionRoutes: RouteDefinition[] = [
  {
    method: "GET",
    path: "/reflection/home",
    handler: getReflectionHomeHandler
  }
];
