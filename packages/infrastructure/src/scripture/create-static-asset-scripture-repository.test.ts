import assert from "node:assert/strict";
import test from "node:test";
import { createStaticAssetScriptureRepository } from "./create-static-asset-scripture-repository";

const createResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });

test("createStaticAssetScriptureRepository returns versions, books, and chapter data", async () => {
  const fetcher: typeof fetch = async (input) => {
    const url = String(input);

    if (url.endsWith("/index.json")) {
      return createResponse({
        versions: [{ id: "kor-revised", name: "개역개정", languageCode: "ko", isDefault: true }],
        books: [{ id: "joshua", name: "여호수아", testament: "old", order: 6, chapterCount: 24 }]
      });
    }

    if (url.endsWith("/books/kor-revised/joshua.json")) {
      return createResponse({
        versionId: "kor-revised",
        book: { id: "joshua", name: "여호수아", testament: "old", order: 6, chapterCount: 24 },
        chapters: {
          "1": {
            chapterNumber: 1,
            heading: "가나안 입성을 준비함",
            verses: [{ verseNumber: 8, text: "이 율법책을 네 입에서 떠나지 말게 하며" }]
          }
        }
      });
    }

    return createResponse({ message: "Not found" }, 404);
  };

  const repository = createStaticAssetScriptureRepository({
    baseUrl: "https://scripture.example.test",
    fetcher
  });

  const versions = await repository.listVersions();
  const books = await repository.listBooks("kor-revised");
  const chapter = await repository.getChapter({
    versionId: "kor-revised",
    bookId: "joshua",
    chapterNumber: 1
  });

  assert.equal(versions[0]?.name, "개역개정");
  assert.equal(books[0]?.name, "여호수아");
  assert.equal(chapter.heading, "가나안 입성을 준비함");
  assert.equal(chapter.verses[0]?.verseNumber, 8);
});
