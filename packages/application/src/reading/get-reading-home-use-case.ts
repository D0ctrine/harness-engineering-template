import type { ReadingHome } from "@harness/domain";

export interface ReadingHomeRepository {
  getReadingHome: () => ReadingHome;
}

export interface GetReadingHomeUseCase {
  execute: () => ReadingHome;
}

export const createGetReadingHomeUseCase = (
  repository: ReadingHomeRepository
): GetReadingHomeUseCase => ({
  execute: () => repository.getReadingHome()
});
