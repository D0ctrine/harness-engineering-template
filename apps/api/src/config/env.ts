import type { RuntimeEnvironment } from "@harness/shared";
import type { D1Database } from "@harness/infrastructure";

export interface AssetBinding {
  fetch: (request: Request | URL | string, init?: RequestInit) => Promise<Response>;
}

export interface ApiBindings extends RuntimeEnvironment {
  ASSETS?: AssetBinding;
  DB?: D1Database;
}
