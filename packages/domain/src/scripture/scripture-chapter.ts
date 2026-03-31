import type { BibleVersion } from "./bible-version";
import type { ScriptureBookSummary } from "./scripture-book-summary";
import type { Verse } from "./verse";

export interface ScriptureChapterQuery {
  versionId: string;
  bookId: string;
  chapterNumber: number;
}

export interface ScriptureChapter {
  version: BibleVersion;
  book: ScriptureBookSummary;
  chapterNumber: number;
  heading: string | null;
  verses: Verse[];
}
