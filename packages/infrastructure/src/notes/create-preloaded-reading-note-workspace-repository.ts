import type { ReadingNoteWorkspaceRepository } from "@harness/application";
import type { ReadingNoteWorkspace } from "@harness/domain";
import { preloadedReadingNoteWorkspace } from "../scripture/data/preloaded-scripture-dataset";

const cloneReadingNoteWorkspace = (value: ReadingNoteWorkspace): ReadingNoteWorkspace => {
  return structuredClone(value);
};

export const createPreloadedReadingNoteWorkspaceRepository = (): ReadingNoteWorkspaceRepository => ({
  getReadingNoteWorkspace: () => cloneReadingNoteWorkspace(preloadedReadingNoteWorkspace)
});
