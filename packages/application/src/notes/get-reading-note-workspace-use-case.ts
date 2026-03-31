import type { ReadingNoteWorkspace } from "@harness/domain";

export interface ReadingNoteWorkspaceRepository {
  getReadingNoteWorkspace: () => ReadingNoteWorkspace;
}

export interface GetReadingNoteWorkspaceUseCase {
  execute: () => ReadingNoteWorkspace;
}

export const createGetReadingNoteWorkspaceUseCase = (
  repository: ReadingNoteWorkspaceRepository
): GetReadingNoteWorkspaceUseCase => ({
  execute: () => repository.getReadingNoteWorkspace()
});
