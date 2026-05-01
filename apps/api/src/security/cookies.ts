export type SameSite = "Lax" | "Strict" | "None";

export interface CookieOptions {
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: SameSite;
  secure?: boolean;
}

export const parseCookies = (cookieHeader: string | null) => {
  const cookies = new Map<string, string>();

  if (!cookieHeader) {
    return cookies;
  }

  cookieHeader.split(";").forEach((entry) => {
    const [name, ...valueParts] = entry.trim().split("=");

    if (!name) {
      return;
    }

    cookies.set(name, decodeURIComponent(valueParts.join("=")));
  });

  return cookies;
};

export const serializeCookie = (name: string, value: string, options: CookieOptions = {}) => {
  const parts = [`${name}=${encodeURIComponent(value)}`];

  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${Math.max(0, Math.floor(options.maxAge))}`);
  }

  parts.push(`Path=${options.path ?? "/"}`);
  parts.push(`SameSite=${options.sameSite ?? "Lax"}`);

  if (options.httpOnly ?? true) {
    parts.push("HttpOnly");
  }

  if (options.secure) {
    parts.push("Secure");
  }

  return parts.join("; ");
};

export const createExpiredCookie = (name: string, path = "/") =>
  serializeCookie(name, "", {
    maxAge: 0,
    path,
    sameSite: "Lax"
  });

export const shouldUseSecureCookie = (request: Request) => {
  const url = new URL(request.url);
  return url.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
};
