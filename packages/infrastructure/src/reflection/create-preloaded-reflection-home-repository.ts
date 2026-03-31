import type { ReflectionHomeRepository } from "@harness/application";
import type { ReflectionHome } from "@harness/domain";
import { preloadedReflectionHome } from "../scripture/data/preloaded-scripture-dataset";

const cloneReflectionHome = (value: ReflectionHome): ReflectionHome => {
  return structuredClone(value);
};

export const createPreloadedReflectionHomeRepository = (): ReflectionHomeRepository => ({
  getReflectionHome: () => cloneReflectionHome(preloadedReflectionHome)
});
