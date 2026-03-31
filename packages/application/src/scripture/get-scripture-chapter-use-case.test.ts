import assert from "node:assert/strict";
import test from "node:test";
import type { ScriptureChapterRepository } from "./get-scripture-chapter-use-case";
import { createGetScriptureChapterUseCase } from "./get-scripture-chapter-use-case";

test("createGetScriptureChapterUseCase returns chapter data", async () => {
  const expected = {
    version: { id: "kor-revised", name: "개역개정", languageCode: "ko", isDefault: true },
    book: { id: "joshua", name: "여호수아", testament: "old" as const, order: 6, chapterCount: 24 },
    chapterNumber: 1,
    heading: "가나안 입성을 준비함",
    verses: [
      {
        versionId: "kor-revised",
        bookId: "joshua",
        bookName: "여호수아",
        chapterNumber: 1,
        verseNumber: 8,
        text: "이 율법책을 네 입에서 떠나지 말게 하며"
      }
    ]
  };

  const repository: ScriptureChapterRepository = {
    getChapter: async () => expected
  };

  const useCase = createGetScriptureChapterUseCase(repository);

  assert.deepEqual(
    await useCase.execute({ versionId: "kor-revised", bookId: "joshua", chapterNumber: 1 }),
    expected
  );
});
