import type { AuthProvider, SsoIdentity } from "@harness/domain";
import type { ApiRuntimeConfig } from "@harness/shared";
import { createExpiredCookie, parseCookies, serializeCookie, shouldUseSecureCookie } from "../../security/cookies";
import { signJwt, verifyJwt } from "../../security/jwt";

const SESSION_COOKIE_NAME = "juyaro_session";
const PENDING_SIGNUP_COOKIE_NAME = "juyaro_pending_signup";
const OAUTH_STATE_COOKIE_NAME = "juyaro_oauth_state";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14;
const PENDING_SIGNUP_TTL_SECONDS = 60 * 30;
const OAUTH_STATE_TTL_SECONDS = 60 * 10;

interface SessionTokenPayload {
  purpose: "session";
  sub: string;
  provider: AuthProvider;
  providerId: string;
  iat: number;
  exp: number;
}

interface PendingSignupTokenPayload extends SsoIdentity {
  purpose: "pending_signup";
  iat: number;
  exp: number;
}

interface OAuthStateTokenPayload {
  purpose: "oauth_state";
  provider: AuthProvider;
  state: string;
  returnTo: string;
  iat: number;
  exp: number;
}

const nowSeconds = () => Math.floor(Date.now() / 1000);

export const createSessionCookie = async (
  request: Request,
  config: ApiRuntimeConfig,
  payload: Pick<SessionTokenPayload, "sub" | "provider" | "providerId">
) => {
  const issuedAt = nowSeconds();
  const token = await signJwt(
    {
      ...payload,
      purpose: "session",
      iat: issuedAt,
      exp: issuedAt + SESSION_TTL_SECONDS
    },
    config.jwtSecret
  );

  return serializeCookie(SESSION_COOKIE_NAME, token, {
    maxAge: SESSION_TTL_SECONDS,
    secure: shouldUseSecureCookie(request)
  });
};

export const createPendingSignupCookie = async (
  request: Request,
  config: ApiRuntimeConfig,
  identity: SsoIdentity
) => {
  const issuedAt = nowSeconds();
  const token = await signJwt(
    {
      ...identity,
      purpose: "pending_signup",
      iat: issuedAt,
      exp: issuedAt + PENDING_SIGNUP_TTL_SECONDS
    },
    config.jwtSecret
  );

  return serializeCookie(PENDING_SIGNUP_COOKIE_NAME, token, {
    maxAge: PENDING_SIGNUP_TTL_SECONDS,
    secure: shouldUseSecureCookie(request)
  });
};

export const createOAuthStateCookie = async (
  request: Request,
  config: ApiRuntimeConfig,
  payload: Pick<OAuthStateTokenPayload, "provider" | "state" | "returnTo">
) => {
  const issuedAt = nowSeconds();
  const token = await signJwt(
    {
      ...payload,
      purpose: "oauth_state",
      iat: issuedAt,
      exp: issuedAt + OAUTH_STATE_TTL_SECONDS
    },
    config.jwtSecret
  );

  return serializeCookie(OAUTH_STATE_COOKIE_NAME, token, {
    maxAge: OAUTH_STATE_TTL_SECONDS,
    secure: shouldUseSecureCookie(request)
  });
};

export const readSessionToken = async (request: Request, config: ApiRuntimeConfig) => {
  const token = parseCookies(request.headers.get("cookie")).get(SESSION_COOKIE_NAME);

  if (!token) {
    return null;
  }

  const payload = await verifyJwt<SessionTokenPayload>(token, config.jwtSecret);

  return payload?.purpose === "session" ? payload : null;
};

export const readPendingSignupToken = async (request: Request, config: ApiRuntimeConfig) => {
  const token = parseCookies(request.headers.get("cookie")).get(PENDING_SIGNUP_COOKIE_NAME);

  if (!token) {
    return null;
  }

  const payload = await verifyJwt<PendingSignupTokenPayload>(token, config.jwtSecret);

  return payload?.purpose === "pending_signup" ? payload : null;
};

export const readOAuthStateToken = async (request: Request, config: ApiRuntimeConfig) => {
  const token = parseCookies(request.headers.get("cookie")).get(OAUTH_STATE_COOKIE_NAME);

  if (!token) {
    return null;
  }

  const payload = await verifyJwt<OAuthStateTokenPayload>(token, config.jwtSecret);

  return payload?.purpose === "oauth_state" ? payload : null;
};

export const appendSessionCookie = async (
  headers: Headers,
  request: Request,
  config: ApiRuntimeConfig,
  payload: Pick<SessionTokenPayload, "sub" | "provider" | "providerId">
) => {
  headers.append("Set-Cookie", await createSessionCookie(request, config, payload));
};

export const appendPendingSignupCookie = async (
  headers: Headers,
  request: Request,
  config: ApiRuntimeConfig,
  identity: SsoIdentity
) => {
  headers.append("Set-Cookie", await createPendingSignupCookie(request, config, identity));
};

export const appendOAuthStateCookie = async (
  headers: Headers,
  request: Request,
  config: ApiRuntimeConfig,
  payload: Pick<OAuthStateTokenPayload, "provider" | "state" | "returnTo">
) => {
  headers.append("Set-Cookie", await createOAuthStateCookie(request, config, payload));
};

export const appendAuthCleanupCookies = (headers: Headers) => {
  headers.append("Set-Cookie", createExpiredCookie(PENDING_SIGNUP_COOKIE_NAME));
  headers.append("Set-Cookie", createExpiredCookie(OAUTH_STATE_COOKIE_NAME));
};

export const appendPendingSignupCleanupCookie = (headers: Headers) => {
  headers.append("Set-Cookie", createExpiredCookie(PENDING_SIGNUP_COOKIE_NAME));
};

export const appendOAuthStateCleanupCookie = (headers: Headers) => {
  headers.append("Set-Cookie", createExpiredCookie(OAUTH_STATE_COOKIE_NAME));
};
