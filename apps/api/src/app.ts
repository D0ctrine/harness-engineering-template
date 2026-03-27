import express from "express";
import cors from "cors";
import { apiConfig } from "./config/env";
import { createHealthRoutes } from "./routes/health-routes";
import { errorHandler } from "./middleware/error-handler";

export const createApp = () => {
  const app = express();

  app.use(cors({ origin: apiConfig.corsOrigin }));
  app.use(express.json());
  app.use(apiConfig.apiPrefix, createHealthRoutes());
  app.use(errorHandler);

  return app;
};
