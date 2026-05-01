import type { RouteDefinition } from "../../http/router";
import { createPostMeditationHandler } from "./handlers/post-meditation-handler";

export const meditationRoutes: RouteDefinition[] = [
  {
    method: "POST",
    path: "/meditation",
    handler: createPostMeditationHandler()
  }
];
