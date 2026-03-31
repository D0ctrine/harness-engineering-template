import type { CommunityPreview } from "@harness/domain";

export interface CommunityPreviewRepository {
  getCommunityPreview: () => CommunityPreview;
}

export interface GetCommunityPreviewUseCase {
  execute: () => CommunityPreview;
}

export const createGetCommunityPreviewUseCase = (
  repository: CommunityPreviewRepository
): GetCommunityPreviewUseCase => ({
  execute: () => repository.getCommunityPreview()
});
