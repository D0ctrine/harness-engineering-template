import assert from "node:assert/strict";
import test from "node:test";
import { createPreloadedCommunityPreviewRepository } from "./create-preloaded-community-preview-repository";

test("createPreloadedCommunityPreviewRepository returns a private group preview with posts", () => {
  const repository = createPreloadedCommunityPreviewRepository();
  const preview = repository.getCommunityPreview();

  assert.equal(preview.group.visibility, "private");
  assert.equal(preview.posts.length, 2);
  assert.equal(preview.membership.role, "member");
  assert.equal(preview.group.name, "데일리 라이트 룸");
});
