export interface ReadingNoteReference {
  readingPlanId: string;
  passageReference: string;
}

export interface CreateReadingNoteInput {
  reference: ReadingNoteReference;
  body: string;
}

export interface UpdateReadingNoteInput {
  id: string;
  body: string;
}

export interface SavedReadingNote {
  id: string;
  reference: ReadingNoteReference;
  body: string;
  updatedAt: string;
}
