import type { Book } from "./book";

export interface ScriptureBookSummary extends Book {
  chapterCount: number;
}
