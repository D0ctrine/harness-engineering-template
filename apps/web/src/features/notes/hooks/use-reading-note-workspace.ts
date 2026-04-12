"use client";

import { useEffect, useState } from "react";
import type { ReadingNoteWorkspace } from "@harness/shared";
import { mapApiErrorToUserMessage, type UserFacingError } from "../../../lib/error-handler";
import { notesService } from "../services/notes-service";

export const useReadingNoteWorkspace = () => {
  const [data, setData] = useState<ReadingNoteWorkspace | null>(null);
  const [error, setError] = useState<UserFacingError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveError, setSaveError] = useState<UserFacingError | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  const saveNote = async (body: string) => {
    if (!data) {
      return null;
    }

    try {
      setIsSaving(true);
      setSaveError(null);

      const savedNote = await notesService.saveReadingNote(data.savedNote, body);

      setData((currentData) => currentData ? { ...currentData, savedNote } : currentData);

      return savedNote;
    } catch (err) {
      setSaveError(mapApiErrorToUserMessage(err));
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return { data, error, isLoading, isSaving, saveError, saveNote };
};
