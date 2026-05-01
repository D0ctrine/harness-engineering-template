import type { Meditation } from "@harness/domain";
import { AuthUnauthorizedError, AuthValidationError } from "../auth/auth-errors";
import type { MeditationRepository } from "./meditation-repository";

export interface SaveMeditationCommand {
  userId?: string | null;
  content: string;
  date: string;
}

export interface SaveMeditationUseCase {
  execute: (command: SaveMeditationCommand) => Promise<Meditation>;
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export const createSaveMeditationUseCase = (
  repository: MeditationRepository
): SaveMeditationUseCase => ({
  execute: async ({ userId, content, date }) => {
    const normalizedContent = content.trim();

    if (!userId) {
      throw new AuthUnauthorizedError();
    }

    if (!normalizedContent) {
      throw new AuthValidationError("저장할 묵상을 입력해 주세요.");
    }

    if (!datePattern.test(date)) {
      throw new AuthValidationError("묵상 날짜 형식이 올바르지 않습니다.");
    }

    return repository.createMeditation({
      userId,
      content: normalizedContent,
      date
    });
  }
});
