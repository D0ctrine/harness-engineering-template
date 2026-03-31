import { Buffer } from "node:buffer";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getApiRuntimeConfig } from "@harness/shared";
import { config as loadEnv } from "dotenv";
import type { ApiBindings } from "./config/env";
import worker from "./worker";

interface LocalExecutionContext {
  passThroughOnException: () => void;
  waitUntil: (promise: Promise<unknown>) => void;
}

const sourceDirectory = dirname(fileURLToPath(import.meta.url));
const repoEnvPath = resolve(sourceDirectory, "../../../.env");

loadEnv({ path: repoEnvPath });

const bindings: ApiBindings = process.env;
const config = getApiRuntimeConfig(bindings);

const readRequestBody = async (request: IncomingMessage) => {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return chunks.length > 0 ? Buffer.concat(chunks) : undefined;
};

const toFetchRequest = async (request: IncomingMessage) => {
  const headers = new Headers();

  Object.entries(request.headers).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      headers.set(key, value.join(", "));
      return;
    }

    if (typeof value === "string") {
      headers.set(key, value);
    }
  });

  const origin = `http://${request.headers.host ?? `localhost:${config.port}`}`;
  const url = new URL(request.url ?? "/", origin);
  const body =
    request.method === "GET" || request.method === "HEAD" || request.method === "OPTIONS"
      ? undefined
      : await readRequestBody(request);

  return new Request(url, {
    method: request.method ?? "GET",
    headers,
    body
  });
};

const createExecutionContext = (): LocalExecutionContext => {
  return {
    passThroughOnException: () => undefined,
    waitUntil: (promise) => {
      void promise;
    }
  };
};

const sendFetchResponse = async (response: Response, nodeResponse: ServerResponse) => {
  nodeResponse.statusCode = response.status;

  response.headers.forEach((value, key) => {
    nodeResponse.setHeader(key, value);
  });

  const body = await response.arrayBuffer();
  nodeResponse.end(Buffer.from(body));
};

const server = createServer(async (request, response) => {
  try {
    const fetchRequest = await toFetchRequest(request);
    const fetchResponse = await worker.fetch(fetchRequest, bindings, createExecutionContext());
    await sendFetchResponse(fetchResponse, response);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";

    response.statusCode = 500;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(
      JSON.stringify({
        message: "Local API runtime error",
        detail
      })
    );
  }
});

server.listen(config.port, () => {
  console.log(`API dev server listening on :${config.port}${config.apiPrefix}`);
});
