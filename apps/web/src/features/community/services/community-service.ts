import { EnterpriseApiClient, type CommunityPreview } from "@harness/shared";
import { runtimeConfig } from "../../../lib/runtime-config";

const apiClient = new EnterpriseApiClient(runtimeConfig.apiBaseUrl);

export const communityService = {
  getCommunityPreview: async (): Promise<CommunityPreview> =>
    apiClient.request<CommunityPreview>("/community/preview")
};
