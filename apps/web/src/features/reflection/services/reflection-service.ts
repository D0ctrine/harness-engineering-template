import { EnterpriseApiClient, type ReflectionHome } from "@harness/shared";
import { runtimeConfig } from "../../../lib/runtime-config";

const apiClient = new EnterpriseApiClient(runtimeConfig.apiBaseUrl);

export const reflectionService = {
  getReflectionHome: async (): Promise<ReflectionHome> =>
    apiClient.request<ReflectionHome>("/reflection/home")
};
