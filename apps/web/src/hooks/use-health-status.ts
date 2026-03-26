"use client";

import { useEffect, useState } from "react";
import type { HealthStatus } from "@harness/shared";
import { healthService } from "../services/health-service";
import { mapApiErrorToUserMessage, type UserFacingError } from "../lib/error-handler";

export const useHealthStatus = () => {
  const [data, setData] = useState<HealthStatus | null>(null);
  const [error, setError] = useState<UserFacingError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await healthService.getHealthStatus();
        setData(response);
      } catch (err) {
        setError(mapApiErrorToUserMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  return { data, error, isLoading };
};
