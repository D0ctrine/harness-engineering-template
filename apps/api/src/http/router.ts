import type { ApiRuntimeConfig } from "@harness/shared";
import type { ApiBindings } from "../config/env";

export interface ApiHandlerContext {
  bindings: ApiBindings;
  config: ApiRuntimeConfig;
}

export type ApiHandler = (request: Request, context: ApiHandlerContext) => Promise<Response> | Response;

export interface RouteDefinition {
  method: string;
  path: string;
  handler: ApiHandler;
}

interface RouteMatchResult {
  allowedMethods: string[];
  route: RouteDefinition | null;
}

const normalizePath = (path: string) => {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }

  return path;
};

export const resolveApiPath = (pathname: string, apiPrefix: string) => {
  const normalizedPrefix = normalizePath(apiPrefix);
  const normalizedPath = normalizePath(pathname);

  if (normalizedPath === normalizedPrefix) {
    return "/";
  }

  if (!normalizedPath.startsWith(`${normalizedPrefix}/`)) {
    return null;
  }

  return normalizedPath.slice(normalizedPrefix.length);
};

export const findRoute = (routes: RouteDefinition[], method: string, path: string): RouteMatchResult => {
  const normalizedPath = normalizePath(path);
  const pathMatches = routes.filter((route) => normalizePath(route.path) === normalizedPath);
  const route = pathMatches.find((candidate) => candidate.method === method) ?? null;

  return {
    allowedMethods: pathMatches.map((candidate) => candidate.method).sort(),
    route
  };
};
