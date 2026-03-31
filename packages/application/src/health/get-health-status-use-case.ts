import type { HealthStatus } from "@harness/domain";

export interface HealthStatusRepository {
  fetchStatus: () => HealthStatus;
}

export interface GetHealthStatusUseCase {
  execute: () => HealthStatus;
}

export const createGetHealthStatusUseCase = (
  repository: HealthStatusRepository
): GetHealthStatusUseCase => ({
  execute: () => repository.fetchStatus()
});
