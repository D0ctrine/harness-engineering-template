"use client";

import { useEffect, useState } from "react";
import { useReflectionHome } from "../hooks/use-reflection-home";

export const ReflectionHomePanel = () => {
  const { data, error, isLoading } = useReflectionHome();
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (data?.answerPreview) {
      setDraft(data.answerPreview);
    }
  }, [data]);

  if (isLoading) {
    return (
      <section className="loading-card">
        <p>묵상 단계를 불러오는 중입니다.</p>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="health-card">
        <div className="health-card__state health-card__state--error">묵상 화면 오류</div>
        <h2>{error?.title ?? "묵상 단계를 찾을 수 없어요"}</h2>
        <p>{error?.message ?? "묵상 단계를 불러오지 못했습니다."}</p>
      </section>
    );
  }

  return (
    <section className="surface-card reflection-panel">
      <p className="reading-section-label">묵상</p>
      <h2>{data.title}</h2>

      <div className="reflection-question-card">
        <strong>{data.question.prompt}</strong>
      </div>

      <label className="note-editor">
        <span className="reading-section-label">답변 초안</span>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={data.answerPlaceholder}
          rows={5}
        />
      </label>
    </section>
  );
};
