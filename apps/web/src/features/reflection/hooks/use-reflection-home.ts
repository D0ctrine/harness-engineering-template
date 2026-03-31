"use client";

import { useEffect, useState } from "react";
import type { ReflectionHome } from "@harness/shared";
import { mapApiErrorToUserMessage, type UserFacingError } from "../../../lib/error-handler";
import { reflectionService } from "../services/reflection-service";

export const useReflectionHome = () => {
  const [data, setData] = useState<ReflectionHome | null>(null);
  const [error, setError] = useState<UserFacingError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        const response = await reflectionService.getReflectionHome();

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
