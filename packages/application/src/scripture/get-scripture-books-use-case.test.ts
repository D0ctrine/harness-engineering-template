import assert from "node:assert/strict";
import test from "node:test";
import type { ScriptureBooksRepository } from "./get-scripture-books-use-case";
import { createGetScriptureBooksUseCase } from "./get-scripture-books-use-case";

test("createGetScriptureBooksUseCase returns available books for a version", async () => {
  const expected = [
    { id: "joshua", name: "여호수아", testament: "old" as const, order: 6, chapterCount: 24 }
  ];

  const repository: ScriptureBooksRepository = {
    listBooks: async () => expected
  };

  const useCase = createGetScriptureBooksUseCase(repository);

  assert.deepEqual(await useCase.execute("kor-revised"), expected);
});
