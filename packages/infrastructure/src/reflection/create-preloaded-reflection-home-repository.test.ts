import assert from "node:assert/strict";
import test from "node:test";
import { createPreloadedReflectionHomeRepository } from "./create-preloaded-reflection-home-repository";

test("createPreloadedReflectionHomeRepository returns the reflection question", () => {
  const repository = createPreloadedReflectionHomeRepository();
  const reflectionHome = repository.getReflectionHome();

  assert.equal(reflectionHome.title, "묵상 질문");
  assert.equal(reflectionHome.question.prompt, "오늘 내 삶에서 말씀을 가까이 두어야 할 자리는 어디인가요?");
});
