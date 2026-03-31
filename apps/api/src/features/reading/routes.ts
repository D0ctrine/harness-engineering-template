import { createGetReadingHomeUseCase } from "@harness/application";
import { createPreloadedReadingHomeRepository } from "@harness/infrastructure";
import type { RouteDefinition } from "../../http/router";
import { createGetReadingHomeHandler } from "./handlers/get-reading-home-handler";

const getReadingHomeHandler = createGetReadingHomeHandler(
  createGetReadingHomeUseCase(createPreloadedReadingHomeRepository())
);

export const readingRoutes: RouteDefinition[] = [
  {
    method: "GET",
    path: "/reading/home",
    handler: getReadingHomeHandler
  }
];
