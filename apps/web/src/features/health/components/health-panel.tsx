"use client";

import { useHealthStatus } from "../hooks/use-health-status";

export const HealthPanel = () => {
  const { data, error, isLoading } = useHealthStatus();

  if (isLoading) {
    return (
      <section className="loading-card">
        <p>Loading health status from the API service layer.</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="health-card">
        <div className="health-card__state health-card__state--error">Service issue</div>
        <h2>{error.title}</h2>
        <p>{error.message}</p>
      </section>
    );
  }

  return (
    <section className="health-card">
      <div className="health-card__state">System health</div>
      <h2>Shared API contract example</h2>
      <p>
        This card still follows the component-hook-service chain and remains the starter pattern for
        new vertical slices.
      </p>
      <ul className="health-list">
        <li>
          <strong>Status</strong>
          <span>{data?.status}</span>
        </li>
        <li>
          <strong>Service</strong>
          <span>{data?.service}</span>
        </li>
        <li>
          <strong>Version</strong>
          <span>{data?.version}</span>
        </li>
        <li>
          <strong>Timestamp</strong>
          <span>{data?.timestamp}</span>
        </li>
      </ul>
    </section>
  );
};
