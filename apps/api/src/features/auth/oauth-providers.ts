import type { AuthProvider, SsoIdentity } from "@harness/domain";
import type { ApiRuntimeConfig, OAuthProviderRuntimeConfig } from "@harness/shared";

interface OAuthProviderSettings {
  provider: AuthProvider;
  clientId: string;
  clientSecret?: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  userInfoEndpoint: string;
  scope: string;
}

interface OAuthTokenResponse {
  access_token?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
}

interface GoogleUserInfo {
  sub?: string;
  name?: string;
}

interface KakaoUserInfo {
  id?: number | string;
  kakao_account?: {
    profile?: {
      nickname?: string;
    };
  };
  properties?: {
    nickname?: string;
  };
}

interface NaverUserInfo {
  response?: {
    id?: string;
    name?: string;
  };
}

export class OAuthConfigurationError extends Error {
  constructor(provider: AuthProvider) {
    super(`${provider} OAuth 환경 변수가 설정되지 않았습니다.`);
    this.name = "OAuthConfigurationError";
  }
}

export class OAuthProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OAuthProviderError";
  }
}

const providerConfigs: Record<AuthProvider, Omit<OAuthProviderSettings, "clientId" | "clientSecret">> = {
  google: {
    provider: "google",
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    userInfoEndpoint: "https://openidconnect.googleapis.com/v1/userinfo",
    scope: "openid profile email"
  },
  kakao: {
    provider: "kakao",
    authorizationEndpoint: "https://kauth.kakao.com/oauth/authorize",
    tokenEndpoint: "https://kauth.kakao.com/oauth/token",
    userInfoEndpoint: "https://kapi.kakao.com/v2/user/me",
    scope: "profile_nickname account_email"
  },
  naver: {
    provider: "naver",
    authorizationEndpoint: "https://nid.naver.com/oauth2.0/authorize",
    tokenEndpoint: "https://nid.naver.com/oauth2.0/token",
    userInfoEndpoint: "https://openapi.naver.com/v1/nid/me",
    scope: "name"
  }
};

export const isAuthProvider = (value: string | null): value is AuthProvider => {
  return value === "google" || value === "kakao" || value === "naver";
};

const resolveProviderSettings = (
  provider: AuthProvider,
  providerRuntimeConfig: OAuthProviderRuntimeConfig
): OAuthProviderSettings => {
  const clientId = providerRuntimeConfig.clientId?.trim();

  if (!clientId) {
    throw new OAuthConfigurationError(provider);
  }

  return {
    ...providerConfigs[provider],
    clientId,
    clientSecret: providerRuntimeConfig.clientSecret?.trim()
  };
};

export const getProviderSettings = (provider: AuthProvider, config: ApiRuntimeConfig) => {
  return resolveProviderSettings(provider, config.oauth[provider]);
};

export const createAuthorizationUrl = (
  settings: OAuthProviderSettings,
  config: ApiRuntimeConfig,
  state: string
) => {
  const url = new URL(settings.authorizationEndpoint);

  url.searchParams.set("client_id", settings.clientId);
  url.searchParams.set("redirect_uri", `${config.apiPublicBaseUrl}/auth/callback`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", settings.scope);
  url.searchParams.set("state", state);

  return url.toString();
};

const requestAccessToken = async (
  settings: OAuthProviderSettings,
  config: ApiRuntimeConfig,
  code: string
) => {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: settings.clientId,
    code,
    redirect_uri: `${config.apiPublicBaseUrl}/auth/callback`
  });

  if (settings.clientSecret) {
    body.set("client_secret", settings.clientSecret);
  }

  const response = await fetch(settings.tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });
  const payload = (await response.json()) as OAuthTokenResponse;

  if (!response.ok || !payload.access_token) {
    throw new OAuthProviderError(payload.error_description ?? payload.error ?? "OAuth token exchange failed.");
  }

  return payload.access_token;
};

const fetchUserInfo = async <Payload>(settings: OAuthProviderSettings, accessToken: string) => {
  const response = await fetch(settings.userInfoEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new OAuthProviderError("OAuth user info request failed.");
  }

  return response.json() as Promise<Payload>;
};

const parseIdentity = (settings: OAuthProviderSettings, payload: unknown): SsoIdentity => {
  if (settings.provider === "google") {
    const googlePayload = payload as GoogleUserInfo;

    if (!googlePayload.sub) {
      throw new OAuthProviderError("Google user info did not include a user id.");
    }

    return {
      provider: "google",
      providerId: googlePayload.sub,
      name: googlePayload.name
    };
  }

  if (settings.provider === "kakao") {
    const kakaoPayload = payload as KakaoUserInfo;
    const providerId = kakaoPayload.id ? String(kakaoPayload.id) : "";

    if (!providerId) {
      throw new OAuthProviderError("Kakao user info did not include a user id.");
    }

    return {
      provider: "kakao",
      providerId,
      name: kakaoPayload.kakao_account?.profile?.nickname ?? kakaoPayload.properties?.nickname
    };
  }

  const naverPayload = payload as NaverUserInfo;
  const providerId = naverPayload.response?.id;

  if (!providerId) {
    throw new OAuthProviderError("Naver user info did not include a user id.");
  }

  return {
    provider: "naver",
    providerId,
    name: naverPayload.response?.name
  };
};

export const fetchSsoIdentity = async (
  settings: OAuthProviderSettings,
  config: ApiRuntimeConfig,
  code: string
) => {
  const accessToken = await requestAccessToken(settings, config, code);
  const userInfo = await fetchUserInfo(settings, accessToken);

  return parseIdentity(settings, userInfo);
};
