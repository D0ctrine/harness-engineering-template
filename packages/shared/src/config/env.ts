export type RuntimeEnvironment = Record<string, unknown>;

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
  webAppBaseUrl: string;
  apiPublicBaseUrl: string;
  scriptureAssetBaseUrl: string;
  databaseUrl: string;
  jwtSecret: string;
  oauth: {
    google: OAuthProviderRuntimeConfig;
    kakao: OAuthProviderRuntimeConfig;
    naver: OAuthProviderRuntimeConfig;
  };
}

export interface OAuthProviderRuntimeConfig {
  clientId?: string;
  clientSecret?: string;
}

const readString = (value: unknown): string | undefined => {
  return typeof value === "string" ? value : undefined;
};

const must = (value: unknown, key: string): string => {
  const text = readString(value);

  if (!text || text.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return text;
};

const optional = (value: unknown): string | undefined => {
  return readString(value);
};

export const getWebRuntimeConfig = (env: RuntimeEnvironment): WebRuntimeConfig => ({
  nodeEnv: optional(env.NODE_ENV) ?? "development",
  logLevel: optional(env.LOG_LEVEL) ?? "info",
  appName: optional(env.NEXT_PUBLIC_APP_NAME) ?? "Juyaro Bible Project",
  appShortName: optional(env.NEXT_PUBLIC_APP_SHORT_NAME) ?? "Juyaro",
  appDescription:
    optional(env.NEXT_PUBLIC_APP_DESCRIPTION) ??
    "모바일 중심 QT 읽기, 메모, 묵상, 그룹 나눔을 하나의 설치형 PWA로 제공합니다.",
  apiBaseUrl: optional(env.NEXT_PUBLIC_API_BASE_URL) ?? "http://localhost:4000/api"
});

export const getApiRuntimeConfig = (env: RuntimeEnvironment): ApiRuntimeConfig => ({
  nodeEnv: optional(env.NODE_ENV) ?? "development",
  logLevel: optional(env.LOG_LEVEL) ?? "info",
  port: Number(optional(env.API_PORT) ?? 4000),
  apiPrefix: optional(env.API_PREFIX) ?? "/api",
  corsOrigin: optional(env.CORS_ORIGIN) ?? "http://localhost:3000",
  webAppBaseUrl: optional(env.WEB_APP_BASE_URL) ?? optional(env.CORS_ORIGIN) ?? "http://localhost:3000",
  apiPublicBaseUrl: optional(env.API_PUBLIC_BASE_URL) ?? `http://localhost:${optional(env.API_PORT) ?? 4000}${optional(env.API_PREFIX) ?? "/api"}`,
  scriptureAssetBaseUrl: optional(env.SCRIPTURE_ASSET_BASE_URL) ?? "http://localhost:3000/scripture",
  databaseUrl: must(env.DATABASE_URL, "DATABASE_URL"),
  jwtSecret: must(env.JWT_SECRET, "JWT_SECRET"),
  oauth: {
    google: {
      clientId: optional(env.GOOGLE_OAUTH_CLIENT_ID),
      clientSecret: optional(env.GOOGLE_OAUTH_CLIENT_SECRET)
    },
    kakao: {
      clientId: optional(env.KAKAO_OAUTH_CLIENT_ID),
      clientSecret: optional(env.KAKAO_OAUTH_CLIENT_SECRET)
    },
    naver: {
      clientId: optional(env.NAVER_OAUTH_CLIENT_ID),
      clientSecret: optional(env.NAVER_OAUTH_CLIENT_SECRET)
    }
  }
});
