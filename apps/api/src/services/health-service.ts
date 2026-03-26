import type { HealthStatus } from "@harness/shared";
import type { HealthRepository } from "../repositories/health-repository";

export interface HealthService {
  getStatus: () => HealthStatus;
}

export const createHealthService = (repository: HealthRepository): HealthService => ({
  getStatus: () => repository.fetchHealthStatus()
});
