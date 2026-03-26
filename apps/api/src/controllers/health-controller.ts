import type { Request, Response } from "express";
import type { HealthService } from "../services/health-service";

export const createHealthController = (healthService: HealthService) => ({
  getHealth: (_req: Request, res: Response): void => {
    const status = healthService.getStatus();
    res.status(200).json(status);
  }
});
