import assert from "node:assert/strict";
import test from "node:test";
import type { ScriptureRepository } from "./get-scripture-versions-use-case";
import { createGetScriptureVersionsUseCase } from "./get-scripture-versions-use-case";

test("createGetScriptureVersionsUseCase returns available versions", async () => {
  const expected = [
    { id: "kor-revised", name: "개역개정", languageCode: "ko", isDefault: true }
  ];

  const repository: ScriptureRepository = {
    listVersions: async () => expected
  };

  const useCase = createGetScriptureVersionsUseCase(repository);

  assert.deepEqual(await useCase.execute(), expected);
});
