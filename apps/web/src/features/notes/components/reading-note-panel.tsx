"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { EditorFormattingState } from "../lib/editor-commands";
import { useReadingNoteWorkspace } from "../hooks/use-reading-note-workspace";
import { useReflectionHome } from "../../reflection/hooks/use-reflection-home";
import { useAuth } from "../../auth/hooks/use-auth";
import { notesService } from "../services/notes-service";
import { RichNoteEditor, type RichNoteEditorHandle } from "./rich-note-editor";

const initialFormattingState: EditorFormattingState = {
  isBold: false,
  color: null
};

export const ReadingNotePanel = () => {
  const { data, error, isLoading, isSaving, saveError, persistDraft, saveNote } = useReadingNoteWorkspace();
  const auth = useAuth();
  const {
    data: reflectionData,
    isLoading: isReflectionLoading
  } = useReflectionHome();
  const editorRef = useRef<RichNoteEditorHandle | null>(null);
  const autoSaveAttemptedRef = useRef(false);
  const [formattingState, setFormattingState] = useState(initialFormattingState);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");

  useEffect(() => {
    if (!data || auth.status !== "authenticated" || auth.requiresOnboarding || isSaving) {
      return;
    }

    const draftDate = notesService.getDraftDate();

    if (!notesService.hasPendingServerSave(draftDate) || autoSaveAttemptedRef.current) {
      return;
    }

    const draft = notesService.readMeditationDraft(draftDate);

    if (!draft) {
      notesService.clearPendingServerSave(draftDate);
      return;
    }

    autoSaveAttemptedRef.current = true;

    void saveNote(draft.body, { mode: "server", date: draftDate }).then((savedNote) => {
      if (savedNote) {
        setSaveStatus("saved");
      } else {
        autoSaveAttemptedRef.current = false;
      }
    });
  }, [auth.requiresOnboarding, auth.status, data, isSaving, saveNote]);

  if (isLoading || isReflectionLoading) {
    return (
      <section className="loading-card">
        <p>묵상 노트를 불러오는 중입니다.</p>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="health-card">
        <div className="health-card__state health-card__state--error">메모 화면 오류</div>
        <h2>{error?.title ?? "메모 작업 영역을 찾을 수 없어요"}</h2>
        <p>{error?.message ?? "메모 화면을 불러오지 못했습니다."}</p>
      </section>
    );
  }

  const formattedUpdatedAt = new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(data.savedNote.updatedAt));
  const editorPlaceholder = reflectionData
    ? [reflectionData.answerPlaceholder, data.placeholder].filter(Boolean).join("\n\n")
    : data.placeholder;
  const handleSaveClick = async () => {
    const body = editorRef.current?.getBodyText() ?? data.savedNote.body;
    const draftDate = notesService.getDraftDate();

    persistDraft(body);

    const refreshedAuth = auth.status === "loading" ? await auth.refreshAuth() : null;
    const canSaveToServer =
      (auth.status === "authenticated" && !auth.requiresOnboarding) ||
      (refreshedAuth?.isAuthenticated === true && refreshedAuth.requiresOnboarding === false);

    if (!canSaveToServer) {
      notesService.markPendingServerSave(draftDate);

      if (!auth.requiresOnboarding && refreshedAuth?.requiresOnboarding !== true) {
        auth.openLoginModal();
      }

      return;
    }

    const savedNote = await saveNote(body, { mode: "server", date: draftDate });

    if (savedNote) {
      setSaveStatus("saved");
    }
  };

  return (
    <section className="note-panel" aria-label="묵상 노트 페이지">
      <div className="note-panel__header">
        <div>
          <p className="reading-section-label">옥스포드 노트</p>
          <h2>{data.title}</h2>
        </div>
        <div className="note-panel__header-side">
          <div className="note-panel__top-actions">
            <Link className="note-panel__share-link" href="/app/share?scope=group">
              나눔하기 &gt;
            </Link>
          </div>
          <div className="note-panel__format-chips" aria-live="polite">
            {formattingState.isBold ? (
              <button
                className="note-format-chip"
                type="button"
                onClick={() => editorRef.current?.clearBold()}
              >
                굵게
              </button>
            ) : null}
            {formattingState.color ? (
              <button
                className="note-format-chip note-format-chip--color"
                type="button"
                onClick={() => editorRef.current?.clearColor()}
              >
                <span
                  className="note-format-chip__swatch"
                  style={{ backgroundColor: formattingState.color }}
                />
                색상
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="note-editor note-editor--oxford">
        <RichNoteEditor
          ref={editorRef}
          initialBody={data.savedNote.body}
          placeholder={editorPlaceholder}
          onBodyChange={persistDraft}
          onFormattingStateChange={setFormattingState}
        />
      </div>

      <div className="note-panel__footer">
        <p>
          {saveError
            ? saveError.message
            : `${saveStatus === "saved" ? "저장되었습니다" : "마지막 저장"}: ${formattedUpdatedAt}`}
        </p>
        <button
          className="button-primary note-panel__save-button"
          type="button"
          onClick={() => void handleSaveClick()}
          disabled={isSaving}
        >
          {isSaving ? "저장 중" : "저장하기"}
        </button>
      </div>
    </section>
  );
};
