import type {
  BibleVersion,
  ScriptureBookSummary,
  ScriptureChapter,
  Verse
} from "@harness/domain";
import type {
  ScriptureBooksRepository,
  ScriptureChapterRepository,
  ScriptureRepository
} from "@harness/application";

interface ScriptureIndexPayload {
  versions: BibleVersion[];
  books: ScriptureBookSummary[];
}

interface ScriptureChapterPayload {
  chapterNumber: number;
  heading: string | null;
  verses: Array<{
    verseNumber: number;
    text: string;
  }>;
}

interface ScriptureBookPayload {
  versionId: string;
  book: ScriptureBookSummary;
  chapters: Record<string, ScriptureChapterPayload>;
}

export interface StaticAssetScriptureRepository
  extends ScriptureRepository,
    ScriptureBooksRepository,
    ScriptureChapterRepository {}

export interface CreateStaticAssetScriptureRepositoryOptions {
  baseUrl: string;
  fetcher?: typeof fetch;
}

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, "");
const clone = <T>(value: T): T => structuredClone(value);

export const createStaticAssetScriptureRepository = ({
  baseUrl,
  fetcher = fetch
}: CreateStaticAssetScriptureRepositoryOptions): StaticAssetScriptureRepository => {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  let indexPromise: Promise<ScriptureIndexPayload> | null = null;
  const bookCache = new Map<string, Promise<ScriptureBookPayload>>();

  const loadJson = async <T>(url: string): Promise<T> => {
    const response = await fetcher(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch scripture asset: ${url} (${response.status})`);
    }

    return (await response.json()) as T;
  };

  const loadIndex = async () => {
    indexPromise ??= loadJson<ScriptureIndexPayload>(`${normalizedBaseUrl}/index.json`);
    return indexPromise;
  };

  const loadBook = async (versionId: string, bookId: string) => {
    const cacheKey = `${versionId}:${bookId}`;
    const cached = bookCache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const payloadPromise = loadJson<ScriptureBookPayload>(
      `${normalizedBaseUrl}/books/${versionId}/${bookId}.json`
    );

    bookCache.set(cacheKey, payloadPromise);
    return payloadPromise;
  };

  return {
    listVersions: async () => {
      const index = await loadIndex();
      return clone(index.versions);
    },
    listBooks: async (versionId) => {
      const index = await loadIndex();
      const version = index.versions.find((candidate) => candidate.id === versionId);

      if (!version) {
        throw new Error(`Unknown scripture version: ${versionId}`);
      }

      return clone(index.books);
    },
    getChapter: async (query) => {
      const index = await loadIndex();
      const version = index.versions.find((candidate) => candidate.id === query.versionId);
      const book = index.books.find((candidate) => candidate.id === query.bookId);

      if (!version) {
        throw new Error(`Unknown scripture version: ${query.versionId}`);
      }

      if (!book) {
        throw new Error(`Unknown scripture book: ${query.bookId}`);
      }

      const payload = await loadBook(query.versionId, query.bookId);
      const chapter = payload.chapters[String(query.chapterNumber)];

      if (!chapter) {
        throw new Error(`Unknown scripture chapter: ${query.bookId} ${query.chapterNumber}`);
      }

      const verses: Verse[] = chapter.verses.map((verse) => ({
        versionId: version.id,
        bookId: book.id,
        bookName: book.name,
        chapterNumber: chapter.chapterNumber,
        verseNumber: verse.verseNumber,
        text: verse.text
      }));

      const result: ScriptureChapter = {
        version,
        book,
        chapterNumber: chapter.chapterNumber,
        heading: chapter.heading,
        verses
      };

      return clone(result);
    }
  };
};
