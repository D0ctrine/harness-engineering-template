import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const outputRoot = path.resolve(repositoryRoot, "apps/web/public/scripture");

const sourceFiles = [
  {
    envKey: "SCRIPTURE_SOURCE_KOR",
    version: { id: "kor-revised", name: "개역개정", languageCode: "ko", isDefault: true },
    path: process.env.SCRIPTURE_SOURCE_KOR
  },
  {
    envKey: "SCRIPTURE_SOURCE_ENG",
    version: { id: "eng-modern", name: "현대영어", languageCode: "en", isDefault: false },
    path: process.env.SCRIPTURE_SOURCE_ENG
  },
  {
    envKey: "SCRIPTURE_SOURCE_NEW",
    version: { id: "kor-new", name: "새번역", languageCode: "ko", isDefault: false },
    path: process.env.SCRIPTURE_SOURCE_NEW
  }
];

const canonicalBooks = [
  ["genesis", "창세기", "old"],
  ["exodus", "출애굽기", "old"],
  ["leviticus", "레위기", "old"],
  ["numbers", "민수기", "old"],
  ["deuteronomy", "신명기", "old"],
  ["joshua", "여호수아", "old"],
  ["judges", "사사기", "old"],
  ["ruth", "룻기", "old"],
  ["1-samuel", "사무엘상", "old"],
  ["2-samuel", "사무엘하", "old"],
  ["1-kings", "열왕기상", "old"],
  ["2-kings", "열왕기하", "old"],
  ["1-chronicles", "역대상", "old"],
  ["2-chronicles", "역대하", "old"],
  ["ezra", "에스라", "old"],
  ["nehemiah", "느헤미야", "old"],
  ["esther", "에스더", "old"],
  ["job", "욥기", "old"],
  ["psalms", "시편", "old"],
  ["proverbs", "잠언", "old"],
  ["ecclesiastes", "전도서", "old"],
  ["song-of-songs", "아가", "old"],
  ["isaiah", "이사야", "old"],
  ["jeremiah", "예레미야", "old"],
  ["lamentations", "예레미야애가", "old"],
  ["ezekiel", "에스겔", "old"],
  ["daniel", "다니엘", "old"],
  ["hosea", "호세아", "old"],
  ["joel", "요엘", "old"],
  ["amos", "아모스", "old"],
  ["obadiah", "오바댜", "old"],
  ["jonah", "요나", "old"],
  ["micah", "미가", "old"],
  ["nahum", "나훔", "old"],
  ["habakkuk", "하박국", "old"],
  ["zephaniah", "스바냐", "old"],
  ["haggai", "학개", "old"],
  ["zechariah", "스가랴", "old"],
  ["malachi", "말라기", "old"],
  ["matthew", "마태복음", "new"],
  ["mark", "마가복음", "new"],
  ["luke", "누가복음", "new"],
  ["john", "요한복음", "new"],
  ["acts", "사도행전", "new"],
  ["romans", "로마서", "new"],
  ["1-corinthians", "고린도전서", "new"],
  ["2-corinthians", "고린도후서", "new"],
  ["galatians", "갈라디아서", "new"],
  ["ephesians", "에베소서", "new"],
  ["philippians", "빌립보서", "new"],
  ["colossians", "골로새서", "new"],
  ["1-thessalonians", "데살로니가전서", "new"],
  ["2-thessalonians", "데살로니가후서", "new"],
  ["1-timothy", "디모데전서", "new"],
  ["2-timothy", "디모데후서", "new"],
  ["titus", "디도서", "new"],
  ["philemon", "빌레몬서", "new"],
  ["hebrews", "히브리서", "new"],
  ["james", "야고보서", "new"],
  ["1-peter", "베드로전서", "new"],
  ["2-peter", "베드로후서", "new"],
  ["1-john", "요한1서", "new"],
  ["2-john", "요한2서", "new"],
  ["3-john", "요한3서", "new"],
  ["jude", "유다서", "new"],
  ["revelation", "요한계시록", "new"]
];

const canonicalBookMap = new Map(
  canonicalBooks.map(([id, name, testament], index) => [name, { id, name, testament, order: index + 1 }])
);

const ensureSources = () => {
  const missing = sourceFiles.filter((entry) => !entry.path);

  if (missing.length > 0) {
    throw new Error(`Missing scripture source path env vars: ${missing.map((entry) => entry.envKey).join(", ")}`);
  }
};

const main = async () => {
  ensureSources();

  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(path.resolve(outputRoot, "books"), { recursive: true });

  const index = {
    generatedAt: new Date().toISOString(),
    versions: sourceFiles.map((entry) => entry.version),
    books: []
  };

  for (const source of sourceFiles) {
    const rows = JSON.parse(await readFile(source.path, "utf8"));
    const books = new Map();

    for (const row of rows) {
      const canonicalBook = canonicalBookMap.get(row.book);

      if (!canonicalBook) {
        throw new Error(`Unknown canonical book name: ${row.book}`);
      }

      let payload = books.get(canonicalBook.id);

      if (!payload) {
        payload = {
          versionId: source.version.id,
          book: {
            id: canonicalBook.id,
            name: canonicalBook.name,
            testament: canonicalBook.testament,
            order: canonicalBook.order,
            chapterCount: 0
          },
          chapters: {}
        };
        books.set(canonicalBook.id, payload);
      }

      const chapterKey = String(row.chapter);

      if (!payload.chapters[chapterKey]) {
        payload.chapters[chapterKey] = {
          chapterNumber: row.chapter,
          heading: row.sub || null,
          verses: []
        };
        payload.book.chapterCount += 1;
      }

      payload.chapters[chapterKey].verses.push({
        verseNumber: row.verse,
        text: row.text
      });

      if (!payload.chapters[chapterKey].heading && row.sub) {
        payload.chapters[chapterKey].heading = row.sub;
      }
    }

    if (index.books.length === 0) {
      index.books = [...books.values()]
        .map((value) => value.book)
        .sort((left, right) => left.order - right.order);
    }

    const versionDirectory = path.resolve(outputRoot, "books", source.version.id);
    await mkdir(versionDirectory, { recursive: true });

    for (const [bookId, payload] of books) {
      await writeFile(path.resolve(versionDirectory, `${bookId}.json`), JSON.stringify(payload));
    }
  }

  await writeFile(path.resolve(outputRoot, "index.json"), JSON.stringify(index));
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
