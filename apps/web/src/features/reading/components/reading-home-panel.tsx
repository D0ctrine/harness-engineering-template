"use client";

import { useReadingHome } from "../hooks/use-reading-home";
import { ReadingPassageCard } from "./reading-passage-card";

export const ReadingHomePanel = () => {
  const { data, error, isLoading } = useReadingHome();

  if (isLoading) {
    return (
      <section className="loading-card">
        <p>오늘의 QT 본문을 불러오는 중입니다.</p>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="health-card">
        <div className="health-card__state health-card__state--error">읽기 화면 오류</div>
        <h2>{error?.title ?? "읽기 데이터를 찾을 수 없어요"}</h2>
        <p>{error?.message ?? "읽기 화면을 불러오지 못했습니다."}</p>
      </section>
    );
  }

  return (
    <section className="reading-home" aria-label="오늘의 말씀 읽기 페이지">
      <div className="reading-home__header">
        <div>
          <p className="reading-section-label">{data.theme}</p>
          <h2>{data.title}</h2>
        </div>
        <span className="reading-reference-pill">오늘의 본문</span>
      </div>

      <ReadingPassageCard
        passage={data.passage}
        reflectionQuestion={data.reflectionQuestion}
        applicationSteps={data.nextSteps}
      />
    </section>
  );
};
