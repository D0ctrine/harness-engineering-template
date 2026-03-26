export const healthSchema = {
  type: "object",
  required: ["status", "service", "timestamp", "version"],
  properties: {
    status: { enum: ["ok", "degraded"] },
    service: { type: "string" },
    timestamp: { type: "string" },
    version: { type: "string" }
  }
};
