import { createGetCommunityPreviewUseCase } from "@harness/application";
import { createPreloadedCommunityPreviewRepository } from "@harness/infrastructure";
import type { RouteDefinition } from "../../http/router";
import { createGetCommunityPreviewHandler } from "./handlers/get-community-preview-handler";

const getCommunityPreviewHandler = createGetCommunityPreviewHandler(
  createGetCommunityPreviewUseCase(createPreloadedCommunityPreviewRepository())
);

export const communityRoutes: RouteDefinition[] = [
  {
    method: "GET",
    path: "/community/preview",
    handler: getCommunityPreviewHandler
  }
];
