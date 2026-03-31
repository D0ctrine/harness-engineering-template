"use client";

import { useEffect, useState } from "react";
import type { ReadingNoteWorkspace } from "@harness/shared";
import { mapApiErrorToUserMessage, type UserFacingError } from "../../../lib/error-handler";
import { notesService } from "../services/notes-service";

export const useReadingNoteWorkspace = () => {
  const [data, setData] = useState<ReadingNoteWorkspace | null>(null);
  const [error, setError] = useState<UserFacingError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        const response = await notesService.getReadingNoteWorkspace();

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
