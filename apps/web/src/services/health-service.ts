import { EnterpriseApiClient, type HealthStatus } from "@harness/shared";
import { runtimeConfig } from "../lib/runtime-config";

const apiClient = new EnterpriseApiClient(runtimeConfig.apiBaseUrl);

export const healthService = {
  getHealthStatus: async (): Promise<HealthStatus> => apiClient.request<HealthStatus>("/health")
};
