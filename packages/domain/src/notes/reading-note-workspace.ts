import type { SavedReadingNote } from "./reading-note";

export interface ReadingNoteWorkspace {
  title: string;
  summary: string;
  placeholder: string;
  savedNote: SavedReadingNote;
}
