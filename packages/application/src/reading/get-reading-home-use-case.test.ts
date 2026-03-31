import assert from "node:assert/strict";
import test from "node:test";
import type { ReadingHomeRepository } from "./get-reading-home-use-case";
import { createGetReadingHomeUseCase } from "./get-reading-home-use-case";

test("createGetReadingHomeUseCase returns reading home data from the repository", () => {
  const expected = {
    planId: "qt-sample",
    title: "Today's QT",
    summary: "summary",
    theme: "theme",
    passage: {
      reference: "Psalm 23:1-4",
      version: {
        id: "kjv",
        name: "King James Version",
        languageCode: "en",
        isDefault: true
      },
      verses: [],
      companionNote: "note"
    },
    reflectionQuestion: "question",
    nextSteps: []
  };

  const repository: ReadingHomeRepository = {
    getReadingHome: () => expected
  };

  const useCase = createGetReadingHomeUseCase(repository);

  assert.deepEqual(useCase.execute(), expected);
});
