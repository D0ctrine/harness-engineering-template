import assert from "node:assert/strict";
import test from "node:test";
import { createPreloadedReadingNoteWorkspaceRepository } from "./create-preloaded-reading-note-workspace-repository";

test("createPreloadedReadingNoteWorkspaceRepository returns a saved note workspace", () => {
  const repository = createPreloadedReadingNoteWorkspaceRepository();
  const workspace = repository.getReadingNoteWorkspace();

  assert.equal(workspace.title, "묵상 노트");
  assert.equal(workspace.savedNote.reference.passageReference, "여호수아 1:1-8");
});
