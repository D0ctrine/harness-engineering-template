"use client";

import { useEffect, useState } from "react";
import type { HealthStatus } from "@harness/shared";
import { mapApiErrorToUserMessage, type UserFacingError } from "../../../lib/error-handler";
import { healthService } from "../services/health-service";

export const useHealthStatus = () => {
  const [data, setData] = useState<HealthStatus | null>(null);
  const [error, setError] = useState<UserFacingError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        const response = await healthService.getHealthStatus();

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
