"use client";

import { useHealthStatus } from "../hooks/use-health-status";

export const HealthPanel = () => {
  const { data, error, isLoading } = useHealthStatus();

  if (isLoading) {
    return (
      <section className="loading-card">
        <p>시스템 상태를 불러오는 중입니다.</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="health-card">
        <div className="health-card__state health-card__state--error">시스템 오류</div>
        <h2>{error.title}</h2>
        <p>{error.message}</p>
      </section>
    );
  }

  return (
    <section className="health-card">
      <div className="health-card__state">시스템 상태</div>
      <h2>서버리스 런타임 점검</h2>
      <p>
        제품 기능이 늘어나더라도 최소 운영 상태를 바로 확인할 수 있도록 남겨 둔 점검 카드입니다.
      </p>
      <ul className="health-list">
        <li>
          <strong>상태</strong>
          <span>{data?.status === "ok" ? "정상" : "저하"}</span>
        </li>
        <li>
          <strong>서비스</strong>
          <span>{data?.service}</span>
        </li>
        <li>
          <strong>버전</strong>
          <span>{data?.version}</span>
        </li>
        <li>
          <strong>시간</strong>
          <span>{data?.timestamp}</span>
        </li>
      </ul>
    </section>
  );
};
