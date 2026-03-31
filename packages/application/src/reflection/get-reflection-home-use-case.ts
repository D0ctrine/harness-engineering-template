import type { ReflectionHome } from "@harness/domain";

export interface ReflectionHomeRepository {
  getReflectionHome: () => ReflectionHome;
}

export interface GetReflectionHomeUseCase {
  execute: () => ReflectionHome;
}

export const createGetReflectionHomeUseCase = (
  repository: ReflectionHomeRepository
): GetReflectionHomeUseCase => ({
  execute: () => repository.getReflectionHome()
});
