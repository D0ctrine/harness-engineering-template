import type { RouteDefinition } from "../../http/router";
import { createGetMeHandler } from "./handlers/get-me-handler";
import { createPostSignupHandler } from "./handlers/post-signup-handler";

export const userRoutes: RouteDefinition[] = [
  {
    method: "GET",
    path: "/me",
    handler: createGetMeHandler()
  },
  {
    method: "POST",
    path: "/signup",
    handler: createPostSignupHandler()
  }
];
