import type { BibleVersion } from "../scripture/bible-version";
import type { Verse } from "../scripture/verse";

export interface ReadingStepPreview {
  title: string;
  description: string;
}

export interface ReadingPassage {
  reference: string;
  version: BibleVersion;
  verses: Verse[];
  companionNote: string;
}

export interface ReadingHome {
  planId: string;
  title: string;
  summary: string;
  theme: string;
  passage: ReadingPassage;
  reflectionQuestion: string;
  nextSteps: ReadingStepPreview[];
}
