"use client";

import { useEffect, useState } from "react";
import type { CommunityPreview } from "@harness/shared";
import { mapApiErrorToUserMessage, type UserFacingError } from "../../../lib/error-handler";
import { communityService } from "../services/community-service";

export const useCommunityPreview = () => {
  const [data, setData] = useState<CommunityPreview | null>(null);
  const [error, setError] = useState<UserFacingError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        const response = await communityService.getCommunityPreview();

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
