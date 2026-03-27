import type { HealthStatus } from "@harness/shared";

export const toHealthStatus = (): HealthStatus => ({
  status: "ok",
  service: "harness-api",
  version: "0.1.0",
  timestamp: new Date().toISOString()
});
