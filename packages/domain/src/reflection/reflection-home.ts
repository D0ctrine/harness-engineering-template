import type { ReflectionQuestion } from "./reflection-question";

export interface ReflectionHome {
  title: string;
  summary: string;
  question: ReflectionQuestion;
  answerPlaceholder: string;
  answerPreview: string;
}
