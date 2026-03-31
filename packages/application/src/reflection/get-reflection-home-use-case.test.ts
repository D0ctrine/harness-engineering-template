import assert from "node:assert/strict";
import test from "node:test";
import type { ReflectionHomeRepository } from "./get-reflection-home-use-case";
import { createGetReflectionHomeUseCase } from "./get-reflection-home-use-case";

test("createGetReflectionHomeUseCase returns reflection data from the repository", () => {
  const expected = {
    title: "Reflection question",
    summary: "summary",
    question: {
      id: "question-1",
      readingPlanId: "plan-1",
      prompt: "prompt"
    },
    answerPlaceholder: "placeholder",
    answerPreview: "preview"
  };

  const repository: ReflectionHomeRepository = {
    getReflectionHome: () => expected
  };

  const useCase = createGetReflectionHomeUseCase(repository);

  assert.deepEqual(useCase.execute(), expected);
});
