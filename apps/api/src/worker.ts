import { getApiRuntimeConfig } from "@harness/shared";
import type { ApiBindings } from "./config/env";
import { authRoutes } from "./features/auth/routes";
import { communityRoutes } from "./features/community/routes";
import { healthRoutes } from "./features/health/routes";
import { meditationRoutes } from "./features/meditation/routes";
import { notesRoutes } from "./features/notes/routes";
import { readingRoutes } from "./features/reading/routes";
import { reflectionRoutes } from "./features/reflection/routes";
import { scriptureRoutes } from "./features/scripture/routes";
import { userRoutes } from "./features/user/routes";
import { findRoute, resolveApiPath, type RouteDefinition } from "./http/router";
import {
  createEmptyResponse,
  createInternalErrorResponse,
  createMethodNotAllowedResponse,
  createNotFoundResponse
} from "./http/response";

interface WorkerExecutionContext {
  waitUntil: (promise: Promise<unknown>) => void;
  passThroughOnException?: () => void;
}

const routes: RouteDefinition[] = [
  ...authRoutes,
  ...healthRoutes,
  ...readingRoutes,
  ...notesRoutes,
  ...reflectionRoutes,
  ...communityRoutes,
  ...scriptureRoutes,
  ...userRoutes,
  ...meditationRoutes
];

export const handleApiRequest = async (request: Request, bindings: ApiBindings): Promise<Response> => {
  const config = getApiRuntimeConfig(bindings);
  const url = new URL(request.url);

  if (request.method === "OPTIONS") {
    return createEmptyResponse(request, config, { status: 204 });
  }

  const apiPath = resolveApiPath(url.pathname, config.apiPrefix);

  if (!apiPath) {
    return createNotFoundResponse(request, config);
  }

  const { allowedMethods, route } = findRoute(routes, request.method, apiPath);

  if (!route && allowedMethods.length > 0) {
    return createMethodNotAllowedResponse(request, config, allowedMethods);
  }

  if (!route) {
    return createNotFoundResponse(request, config);
  }

  return route.handler(request, {
    bindings,
    config
  });
};

const worker = {
  async fetch(request: Request, bindings: ApiBindings, _context: WorkerExecutionContext): Promise<Response> {
    try {
      return await handleApiRequest(request, bindings);
    } catch (error) {
      const config = getApiRuntimeConfig(bindings);
      return createInternalErrorResponse(request, config, error);
    }
  }
};

export default worker;
