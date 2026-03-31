import type { CommunityPreviewRepository } from "@harness/application";
import type { CommunityPreview } from "@harness/domain";
import { preloadedCommunityPreview } from "../scripture/data/preloaded-scripture-dataset";

const cloneCommunityPreview = (value: CommunityPreview): CommunityPreview => {
  return structuredClone(value);
};

export const createPreloadedCommunityPreviewRepository = (): CommunityPreviewRepository => ({
  getCommunityPreview: () => cloneCommunityPreview(preloadedCommunityPreview)
});
