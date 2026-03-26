import { toHealthStatus } from "../models/health-model";

export interface HealthRepository {
  fetchHealthStatus: () => ReturnType<typeof toHealthStatus>;
}

export const createHealthRepository = (): HealthRepository => ({
  fetchHealthStatus: () => toHealthStatus()
});
