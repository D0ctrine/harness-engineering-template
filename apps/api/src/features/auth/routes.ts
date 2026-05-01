import type { RouteDefinition } from "../../http/router";
import { createGetAuthCallbackHandler } from "./handlers/get-auth-callback-handler";
import { createGetAuthLoginHandler } from "./handlers/get-auth-login-handler";

export const authRoutes: RouteDefinition[] = [
  {
    method: "GET",
    path: "/auth/login",
    handler: createGetAuthLoginHandler()
  },
  {
    method: "GET",
    path: "/auth/callback",
    handler: createGetAuthCallbackHandler()
  }
];
