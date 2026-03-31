import type { RuntimeEnvironment } from "@harness/shared";

export interface AssetBinding {
  fetch: (request: Request | URL | string, init?: RequestInit) => Promise<Response>;
}

export interface ApiBindings extends RuntimeEnvironment {
  ASSETS?: AssetBinding;
}
