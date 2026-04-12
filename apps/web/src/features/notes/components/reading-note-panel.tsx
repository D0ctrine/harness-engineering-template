"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { EditorFormattingState } from "../lib/editor-commands";
import { useReadingNoteWorkspace } from "../hooks/use-reading-note-workspace";
import { useReflectionHome } from "../../reflection/hooks/use-reflection-home";
import { RichNoteEditor, type RichNoteEditorHandle } from "./rich-note-editor";

const initialFormattingState: EditorFormattingState = {
  isBold: false,
  color: null
};

export const ReadingNotePanel = () => {
  const { data, error, isLoading, isSaving, saveError, saveNote } = useReadingNoteWorkspace();
  const {
    data: reflectionData,
    error: reflectionError,
    isLoading: isReflectionLoading
  } = useReflectionHome();
  const editorRef = useRef<RichNoteEditorHandle | null>(null);
  const [formattingState, setFormattingState] = useState(initialFormattingState);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");

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
    ? `${reflectionData.answerPlaceholder}\n\n${data.placeholder}`
    : data.placeholder;
  const handleSaveClick = async () => {
    const savedNote = await saveNote(editorRef.current?.getBodyText() ?? data.savedNote.body);

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
            <span className="reading-reference-pill">{data.savedNote.reference.passageReference}</span>
            <Link className="note-panel__share-link" href="/app/share?scope=group" aria-label="나눔 보기">
              <span aria-hidden="true">&gt;</span>
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

      <div className="note-panel__prompt">
        <p className="reading-section-label">묵상 질문</p>
        {reflectionData ? (
          <>
            <strong>{reflectionData.question.prompt}</strong>
            <p>아래 옥스포드 노트에 질문의 답변과 오늘의 묵상을 함께 적어 보세요.</p>
          </>
        ) : (
          <p>{reflectionError?.message ?? "묵상 질문을 불러오지 못했습니다."}</p>
        )}
      </div>

      <div className="note-editor note-editor--oxford">
        <RichNoteEditor
          ref={editorRef}
          initialBody={data.savedNote.body}
          placeholder={editorPlaceholder}
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
