export interface BaseRuntimeConfig {
  nodeEnv: string;
  logLevel: string;
}

export interface WebRuntimeConfig extends BaseRuntimeConfig {
  appName: string;
  appShortName: string;
  appDescription: string;
  apiBaseUrl: string;
}

export interface ApiRuntimeConfig extends BaseRuntimeConfig {
  port: number;
  apiPrefix: string;
  corsOrigin: string;
  databaseUrl: string;
  jwtSecret: string;
}

const must = (value: string | undefined, key: string): string => {
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const getWebRuntimeConfig = (env: NodeJS.ProcessEnv): WebRuntimeConfig => ({
  nodeEnv: env.NODE_ENV ?? "development",
  logLevel: env.LOG_LEVEL ?? "info",
  appName: env.NEXT_PUBLIC_APP_NAME ?? "Harness Engineering Template",
  appShortName: env.NEXT_PUBLIC_APP_SHORT_NAME ?? "Harness",
  appDescription:
    env.NEXT_PUBLIC_APP_DESCRIPTION ??
    "Reusable enterprise harness for installable web and app-shell delivery.",
  apiBaseUrl: env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api"
});

export const getApiRuntimeConfig = (env: NodeJS.ProcessEnv): ApiRuntimeConfig => ({
  nodeEnv: env.NODE_ENV ?? "development",
  logLevel: env.LOG_LEVEL ?? "info",
  port: Number(env.API_PORT ?? 4000),
  apiPrefix: env.API_PREFIX ?? "/api",
  corsOrigin: env.CORS_ORIGIN ?? "http://localhost:3000",
  databaseUrl: must(env.DATABASE_URL, "DATABASE_URL"),
  jwtSecret: must(env.JWT_SECRET, "JWT_SECRET")
});
