import type { BibleVersion } from "@harness/domain";

export interface ScriptureRepository {
  listVersions: () => Promise<BibleVersion[]>;
}

export interface GetScriptureVersionsUseCase {
  execute: () => Promise<BibleVersion[]>;
}

export const createGetScriptureVersionsUseCase = (
  repository: ScriptureRepository
): GetScriptureVersionsUseCase => ({
  execute: () => repository.listVersions()
});
