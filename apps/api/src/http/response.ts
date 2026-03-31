import type { ApiRuntimeConfig } from "@harness/shared";

const ACCESS_CONTROL_ALLOW_HEADERS = "content-type, authorization";
const ACCESS_CONTROL_ALLOW_METHODS = "GET,POST,PUT,PATCH,DELETE,OPTIONS";

const isLocalDevelopmentOrigin = (origin: string) => {
  try {
    const url = new URL(origin);
    return ["localhost", "127.0.0.1"].includes(url.hostname);
  } catch {
    return false;
  }
};

const resolveAllowedOrigin = (request: Request, config: ApiRuntimeConfig) => {
  const { corsOrigin, nodeEnv } = config;

  if (corsOrigin === "*") {
    return "*";
  }

  const requestOrigin = request.headers.get("origin");

  if (requestOrigin && requestOrigin === corsOrigin) {
    return requestOrigin;
  }

  if (requestOrigin && nodeEnv === "development" && isLocalDevelopmentOrigin(requestOrigin)) {
    return requestOrigin;
  }

  return corsOrigin;
};

const applyCorsHeaders = (headers: Headers, request: Request, config: ApiRuntimeConfig) => {
  headers.set("Access-Control-Allow-Origin", resolveAllowedOrigin(request, config));
  headers.set("Access-Control-Allow-Methods", ACCESS_CONTROL_ALLOW_METHODS);
  headers.set("Access-Control-Allow-Headers", ACCESS_CONTROL_ALLOW_HEADERS);
  headers.set("Vary", "Origin");

  return headers;
};

export const createJsonResponse = (
  body: unknown,
  request: Request,
  config: ApiRuntimeConfig,
  init: ResponseInit = {}
) => {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");

  return new Response(JSON.stringify(body), {
    ...init,
    headers: applyCorsHeaders(headers, request, config)
  });
};

export const createEmptyResponse = (request: Request, config: ApiRuntimeConfig, init: ResponseInit = {}) => {
  const headers = new Headers(init.headers);

  return new Response(null, {
    ...init,
    headers: applyCorsHeaders(headers, request, config)
  });
};

export const createNotFoundResponse = (request: Request, config: ApiRuntimeConfig) => {
  return createJsonResponse({ message: "Not found" }, request, config, { status: 404 });
};

export const createMethodNotAllowedResponse = (
  request: Request,
  config: ApiRuntimeConfig,
  allowedMethods: string[]
) => {
  return createJsonResponse(
    { message: "Method not allowed" },
    request,
    config,
    {
      status: 405,
      headers: {
        Allow: allowedMethods.join(", ")
      }
    }
  );
};

export const createInternalErrorResponse = (request: Request, config: ApiRuntimeConfig, error: unknown) => {
  const detail = error instanceof Error ? error.message : "Unknown error";

  return createJsonResponse(
    {
      message: "Internal server error",
      detail
    },
    request,
    config,
    { status: 500 }
  );
};
