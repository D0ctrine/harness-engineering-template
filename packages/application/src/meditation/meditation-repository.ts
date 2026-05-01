import type { CreateMeditationInput, Meditation } from "@harness/domain";

export interface MeditationRepository {
  createMeditation: (input: CreateMeditationInput) => Promise<Meditation>;
}
