import {
  EnterpriseApiClient,
  type MeditationSaveResponse,
  type ReadingNoteWorkspace,
  type SavedReadingNote
} from "@harness/shared";
import { runtimeConfig } from "../../../lib/runtime-config";

const apiClient = new EnterpriseApiClient(runtimeConfig.apiBaseUrl);
const SAVED_NOTE_STORAGE_PREFIX = "juyaro-reading-note";
const MEDITATION_DRAFT_STORAGE_PREFIX = "meditation_draft";
const PENDING_SAVE_STORAGE_PREFIX = "meditation_pending_save";

interface StoredReadingNote {
  body: string;
  updatedAt: string;
}

const createSavedNoteStorageKey = (noteId: string) => `${SAVED_NOTE_STORAGE_PREFIX}:${noteId}`;
const createMeditationDraftStorageKey = (date: string) => `${MEDITATION_DRAFT_STORAGE_PREFIX}_${date}`;
const createPendingSaveStorageKey = (date: string) => `${PENDING_SAVE_STORAGE_PREFIX}_${date}`;

const todayDraftDate = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${now.getFullYear()}-${month}-${day}`;
};

const safeLocalStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
};

const readJsonFromStorage = <Value>(storageKey: string): Value | null => {
  const storage = safeLocalStorage();

  if (!storage) {
    return null;
  }

  const storedValue = storage.getItem(storageKey);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue) as Value;
  } catch (error) {
    console.warn("Stored value could not be parsed.", error);
    storage.removeItem(storageKey);
    return null;
  }
};

const writeJsonToStorage = (storageKey: string, value: unknown) => {
  const storage = safeLocalStorage();

  if (!storage) {
    return;
  }

  storage.setItem(storageKey, JSON.stringify(value));
};

const removeFromStorage = (storageKey: string) => {
  safeLocalStorage()?.removeItem(storageKey);
};

const readStoredNote = (noteId: string): StoredReadingNote | null => {
  return readJsonFromStorage<StoredReadingNote>(createSavedNoteStorageKey(noteId));
};

const writeStoredNote = (noteId: string, note: StoredReadingNote) => {
  writeJsonToStorage(createSavedNoteStorageKey(noteId), note);
};

const readMeditationDraft = (date: string): StoredReadingNote | null => {
  return readJsonFromStorage<StoredReadingNote>(createMeditationDraftStorageKey(date));
};

const writeMeditationDraft = (date: string, note: StoredReadingNote) => {
  writeJsonToStorage(createMeditationDraftStorageKey(date), note);
};

const clearMeditationDraft = (date: string, noteId: string) => {
  removeFromStorage(createMeditationDraftStorageKey(date));
  removeFromStorage(createSavedNoteStorageKey(noteId));
};

const applyStoredNote = (workspace: ReadingNoteWorkspace): ReadingNoteWorkspace => {
  const draftDate = todayDraftDate();
  const storedNote = readMeditationDraft(draftDate) ?? readStoredNote(workspace.savedNote.id);

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
  getDraftDate: todayDraftDate,
  readMeditationDraft,
  markPendingServerSave: (date: string) => {
    writeJsonToStorage(createPendingSaveStorageKey(date), { createdAt: new Date().toISOString() });
  },
  clearPendingServerSave: (date: string) => {
    removeFromStorage(createPendingSaveStorageKey(date));
  },
  hasPendingServerSave: (date: string) => {
    return readJsonFromStorage<{ createdAt: string }>(createPendingSaveStorageKey(date)) !== null;
  },
  persistMeditationDraft: (note: SavedReadingNote, body: string): SavedReadingNote => {
    const updatedAt = new Date().toISOString();
    const draftDate = todayDraftDate();
    const storedNote = { body, updatedAt };

    writeMeditationDraft(draftDate, storedNote);
    writeStoredNote(note.id, storedNote);

    return {
      ...note,
      body,
      updatedAt
    };
  },
  getReadingNoteWorkspace: async (): Promise<ReadingNoteWorkspace> =>
    applyStoredNote(await apiClient.request<ReadingNoteWorkspace>("/notes/workspace")),
  saveReadingNoteDraft: async (note: SavedReadingNote, body: string): Promise<SavedReadingNote> => {
    return notesService.persistMeditationDraft(note, body);
  },
  saveReadingNoteToServer: async (note: SavedReadingNote, body: string, date: string): Promise<SavedReadingNote> => {
    const draftUpdatedAt = new Date().toISOString();

    writeStoredNote(note.id, { body, updatedAt: draftUpdatedAt });
    const response = await apiClient.request<MeditationSaveResponse>("/meditation", "POST", {
      content: body,
      date
    });
    clearMeditationDraft(date, note.id);
    notesService.clearPendingServerSave(date);

    return {
      ...note,
      body,
      updatedAt: response.meditation.createdAt
    };
  }
};
