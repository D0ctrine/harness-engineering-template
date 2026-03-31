"use client";

import { useRef, useState } from "react";
import type { EditorFormattingState } from "../lib/editor-commands";
import { useReadingNoteWorkspace } from "../hooks/use-reading-note-workspace";
import { RichNoteEditor, type RichNoteEditorHandle } from "./rich-note-editor";

const initialFormattingState: EditorFormattingState = {
  isBold: false,
  color: null
};

export const ReadingNotePanel = () => {
  const { data, error, isLoading } = useReadingNoteWorkspace();
  const editorRef = useRef<RichNoteEditorHandle | null>(null);
  const [formattingState, setFormattingState] = useState(initialFormattingState);

  if (isLoading) {
    return (
      <section className="loading-card">
        <p>메모 작업 영역을 불러오는 중입니다.</p>
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

  return (
    <section className="note-panel" aria-label="묵상 노트 페이지">
      <div className="note-panel__header">
        <div>
          <p className="reading-section-label">옥스포드 노트</p>
          <h2>{data.title}</h2>
        </div>
        <div className="note-panel__header-side">
          <span className="reading-reference-pill">{data.savedNote.reference.passageReference}</span>
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
          placeholder={data.placeholder}
          onFormattingStateChange={setFormattingState}
        />
      </div>

      <div className="note-panel__footer">
        <p>마지막 저장 미리보기: {formattedUpdatedAt}</p>
      </div>
    </section>
  );
};
