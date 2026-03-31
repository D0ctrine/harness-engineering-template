import assert from "node:assert/strict";
import test from "node:test";
import type { ReadingNoteWorkspaceRepository } from "./get-reading-note-workspace-use-case";
import { createGetReadingNoteWorkspaceUseCase } from "./get-reading-note-workspace-use-case";

test("createGetReadingNoteWorkspaceUseCase returns note workspace data from the repository", () => {
  const expected = {
    title: "Reading note",
    summary: "summary",
    placeholder: "placeholder",
    savedNote: {
      id: "note-1",
      reference: {
        readingPlanId: "plan-1",
        passageReference: "Psalm 23:1-4"
      },
      body: "body",
      updatedAt: "2026-03-28T00:00:00.000Z"
    }
  };

  const repository: ReadingNoteWorkspaceRepository = {
    getReadingNoteWorkspace: () => expected
  };

  const useCase = createGetReadingNoteWorkspaceUseCase(repository);

  assert.deepEqual(useCase.execute(), expected);
});
