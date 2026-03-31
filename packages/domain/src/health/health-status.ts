export interface HealthStatus {
  status: "ok" | "degraded";
  service: string;
  timestamp: string;
  version: string;
}

export interface CreateHealthStatusParams {
  service: string;
  version: string;
  now?: Date;
}

export const createHealthStatus = ({
  service,
  version,
  now = new Date()
}: CreateHealthStatusParams): HealthStatus => ({
  status: "ok",
  service,
  version,
  timestamp: now.toISOString()
});
