import type { ApiRuntimeConfig } from "@harness/shared";

export const createRedirectResponse = (location: string, headers: Headers = new Headers()) => {
  headers.set("Location", location);
  return new Response(null, {
    status: 302,
    headers
  });
};

export const resolveSafeReturnTo = (value: string | null, config: ApiRuntimeConfig) => {
  if (!value) {
    return "/app";
  }

  try {
    const url = new URL(value, config.webAppBaseUrl);
    const webBaseUrl = new URL(config.webAppBaseUrl);

    if (url.origin !== webBaseUrl.origin) {
      return "/app";
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/app";
  }
};

export const toWebAppUrl = (returnTo: string, config: ApiRuntimeConfig) => {
  return new URL(returnTo, config.webAppBaseUrl).toString();
};
