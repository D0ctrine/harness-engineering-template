export interface Meditation {
  id: string;
  userId: string;
  content: string;
  date: string;
  createdAt: string;
}

export interface CreateMeditationInput {
  userId: string;
  content: string;
  date: string;
}
