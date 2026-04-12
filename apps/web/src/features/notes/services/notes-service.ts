import {
  EnterpriseApiClient,
  type ReadingNoteWorkspace,
  type SavedReadingNote
} from "@harness/shared";
import { runtimeConfig } from "../../../lib/runtime-config";

const apiClient = new EnterpriseApiClient(runtimeConfig.apiBaseUrl);
const SAVED_NOTE_STORAGE_PREFIX = "juyaro-reading-note";

interface StoredReadingNote {
  body: string;
  updatedAt: string;
}

const createSavedNoteStorageKey = (noteId: string) => `${SAVED_NOTE_STORAGE_PREFIX}:${noteId}`;

const readStoredNote = (noteId: string): StoredReadingNote | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const storageKey = createSavedNoteStorageKey(noteId);
  const storedValue = window.localStorage.getItem(storageKey);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue) as StoredReadingNote;
  } catch (error) {
    console.warn("Stored reading note could not be parsed.", error);
    window.localStorage.removeItem(storageKey);
    return null;
  }
};

const writeStoredNote = (noteId: string, note: StoredReadingNote) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(createSavedNoteStorageKey(noteId), JSON.stringify(note));
};

const applyStoredNote = (workspace: ReadingNoteWorkspace): ReadingNoteWorkspace => {
  const storedNote = readStoredNote(workspace.savedNote.id);

  if (!storedNote) {
    return workspace;
  }

  return {
    ...workspace,
    savedNote: {
      ...workspace.savedNote,
      body: storedNote.body,
      updatedAt: storedNote.updatedAt
    }
  };
};

export const notesService = {
  getReadingNoteWorkspace: async (): Promise<ReadingNoteWorkspace> =>
    applyStoredNote(await apiClient.request<ReadingNoteWorkspace>("/notes/workspace")),
  saveReadingNote: async (note: SavedReadingNote, body: string): Promise<SavedReadingNote> => {
    const updatedAt = new Date().toISOString();

    writeStoredNote(note.id, { body, updatedAt });

    return {
      ...note,
      body,
      updatedAt
    };
  }
};
