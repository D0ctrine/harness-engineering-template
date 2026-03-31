import assert from "node:assert/strict";
import test from "node:test";
import type { CommunityPreviewRepository } from "./get-community-preview-use-case";
import { createGetCommunityPreviewUseCase } from "./get-community-preview-use-case";

test("createGetCommunityPreviewUseCase returns community preview data from the repository", () => {
  const expected = {
    title: "Group sharing preview",
    summary: "summary",
    group: {
      id: "group-1",
      name: "Daily Light Room",
      description: "description",
      visibility: "private" as const
    },
    membership: {
      groupId: "group-1",
      userId: "user-1",
      role: "member" as const
    },
    posts: []
  };

  const repository: CommunityPreviewRepository = {
    getCommunityPreview: () => expected
  };

  const useCase = createGetCommunityPreviewUseCase(repository);

  assert.deepEqual(useCase.execute(), expected);
});
