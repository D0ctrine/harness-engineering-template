import type { ScriptureChapter, ScriptureChapterQuery } from "@harness/domain";

export interface ScriptureChapterRepository {
  getChapter: (query: ScriptureChapterQuery) => Promise<ScriptureChapter>;
}

export interface GetScriptureChapterUseCase {
  execute: (query: ScriptureChapterQuery) => Promise<ScriptureChapter>;
}

export const createGetScriptureChapterUseCase = (
  repository: ScriptureChapterRepository
): GetScriptureChapterUseCase => ({
  execute: (query) => repository.getChapter(query)
});
