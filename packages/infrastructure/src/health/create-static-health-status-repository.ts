import type { HealthStatusRepository } from "@harness/application";
import { createHealthStatus } from "@harness/domain";

export interface StaticHealthStatusRepositoryOptions {
  service: string;
  version: string;
  now?: () => Date;
}

export const createStaticHealthStatusRepository = ({
  service,
  version,
  now = () => new Date()
}: StaticHealthStatusRepositoryOptions): HealthStatusRepository => ({
  fetchStatus: () =>
    createHealthStatus({
      service,
      version,
      now: now()
    })
});
