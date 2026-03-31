"use client";

import { useEffect, useState } from "react";
import type { ReadingHome } from "@harness/shared";
import { mapApiErrorToUserMessage, type UserFacingError } from "../../../lib/error-handler";
import { readingService } from "../services/reading-service";

export const useReadingHome = () => {
  const [data, setData] = useState<ReadingHome | null>(null);
  const [error, setError] = useState<UserFacingError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        const response = await readingService.getReadingHome();

        if (isActive) {
          setData(response);
        }
      } catch (err) {
        if (isActive) {
          setError(mapApiErrorToUserMessage(err));
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isActive = false;
    };
  }, []);

  return { data, error, isLoading };
};
