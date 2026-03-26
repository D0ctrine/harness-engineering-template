"use client";

import { useHealthStatus } from "../hooks/use-health-status";

export const HealthPanel = () => {
  const { data, error, isLoading } = useHealthStatus();

  if (isLoading) {
    return <p>Loading health status...</p>;
  }

  if (error) {
    return (
      <section>
        <h2>{error.title}</h2>
        <p>{error.message}</p>
      </section>
    );
  }

  return (
    <section>
      <h2>System health</h2>
      <ul>
        <li>Status: {data?.status}</li>
        <li>Service: {data?.service}</li>
        <li>Version: {data?.version}</li>
        <li>Timestamp: {data?.timestamp}</li>
      </ul>
    </section>
  );
};
