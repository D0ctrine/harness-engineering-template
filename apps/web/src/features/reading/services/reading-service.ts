import { EnterpriseApiClient, type ReadingHome } from "@harness/shared";
import { runtimeConfig } from "../../../lib/runtime-config";

const apiClient = new EnterpriseApiClient(runtimeConfig.apiBaseUrl);

export const readingService = {
  getReadingHome: async (): Promise<ReadingHome> => apiClient.request<ReadingHome>("/reading/home")
};
