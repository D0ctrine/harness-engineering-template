import type { ReadingHomeRepository } from "@harness/application";
import type { ReadingHome } from "@harness/domain";
import { preloadedReadingHome } from "../scripture/data/preloaded-scripture-dataset";

const cloneReadingHome = (value: ReadingHome): ReadingHome => {
  return structuredClone(value);
};

export const createPreloadedReadingHomeRepository = (): ReadingHomeRepository => ({
  getReadingHome: () => cloneReadingHome(preloadedReadingHome)
});
