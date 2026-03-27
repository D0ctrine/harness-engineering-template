import "dotenv/config";
import { getApiRuntimeConfig } from "@harness/shared";

export const apiConfig = getApiRuntimeConfig(process.env);
