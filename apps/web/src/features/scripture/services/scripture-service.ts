import type { BibleVersion, ScriptureBookSummary, ScriptureChapter } from "@harness/shared";
import { EnterpriseApiClient } from "@harness/shared";
import { runtimeConfig } from "../../../lib/runtime-config";

const apiClient = new EnterpriseApiClient(runtimeConfig.apiBaseUrl);

export const scriptureService = {
  getVersions: async (): Promise<BibleVersion[]> => apiClient.request<BibleVersion[]>("/scripture/versions"),
  getBooks: async (versionId: string): Promise<ScriptureBookSummary[]> =>
    apiClient.request<ScriptureBookSummary[]>(
      `/scripture/books?versionId=${encodeURIComponent(versionId)}`
    ),
  getChapter: async (params: {
    versionId: string;
    bookId: string;
    chapter: number;
  }): Promise<ScriptureChapter> =>
    apiClient.request<ScriptureChapter>(
      `/scripture/chapter?versionId=${encodeURIComponent(params.versionId)}&bookId=${encodeURIComponent(
        params.bookId
      )}&chapter=${params.chapter}`
    )
};
