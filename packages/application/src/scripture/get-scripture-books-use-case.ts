import type { ScriptureBookSummary } from "@harness/domain";

export interface ScriptureBooksRepository {
  listBooks: (versionId: string) => Promise<ScriptureBookSummary[]>;
}

export interface GetScriptureBooksUseCase {
  execute: (versionId: string) => Promise<ScriptureBookSummary[]>;
}

export const createGetScriptureBooksUseCase = (
  repository: ScriptureBooksRepository
): GetScriptureBooksUseCase => ({
  execute: (versionId) => repository.listBooks(versionId)
});
