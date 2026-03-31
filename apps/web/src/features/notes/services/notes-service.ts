import { EnterpriseApiClient, type ReadingNoteWorkspace } from "@harness/shared";
import { runtimeConfig } from "../../../lib/runtime-config";

const apiClient = new EnterpriseApiClient(runtimeConfig.apiBaseUrl);

export const notesService = {
  getReadingNoteWorkspace: async (): Promise<ReadingNoteWorkspace> =>
    apiClient.request<ReadingNoteWorkspace>("/notes/workspace")
};
