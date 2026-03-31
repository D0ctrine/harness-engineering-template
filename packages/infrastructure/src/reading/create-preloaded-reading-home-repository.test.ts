import assert from "node:assert/strict";
import test from "node:test";
import { createPreloadedReadingHomeRepository } from "./create-preloaded-reading-home-repository";

test("createPreloadedReadingHomeRepository returns a reading home with the featured verse", () => {
  const repository = createPreloadedReadingHomeRepository();

  const readingHome = repository.getReadingHome();

  assert.equal(readingHome.planId, "qt-joshua-1-1-8-meditation");
  assert.equal(readingHome.passage.reference, "여호수아 1:1-8");
  assert.equal(readingHome.passage.verses.length, 8);
});

test("createPreloadedReadingHomeRepository returns cloned data for each call", () => {
  const repository = createPreloadedReadingHomeRepository();

  const first = repository.getReadingHome();
  first.title = "changed locally";

  const second = repository.getReadingHome();

  assert.equal(second.title, "오늘의 말씀");
});
