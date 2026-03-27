import { Router } from "express";
import { createHealthController } from "../controllers/health-controller";
import { createHealthService } from "../services/health-service";
import { createHealthRepository } from "../repositories/health-repository";

export const createHealthRoutes = (): Router => {
  const repository = createHealthRepository();
  const service = createHealthService(repository);
  const controller = createHealthController(service);

  const router = Router();
  router.get("/health", controller.getHealth);
  return router;
};
