"use client";

import {
  EnterpriseApiClient,
  type AuthMeResponse,
  type AuthProvider,
  type SignupRequest,
  type SignupResponse
} from "@harness/shared";
import { runtimeConfig } from "../../../lib/runtime-config";

const apiClient = new EnterpriseApiClient(runtimeConfig.apiBaseUrl);

const resolveApiUrl = (path: string) => {
  const baseUrl = runtimeConfig.apiBaseUrl.replace(/\/$/, "");

  if (typeof window === "undefined") {
    return `${baseUrl}${path}`;
  }

  try {
    const url = new URL(baseUrl);
    const currentHost = window.location.hostname;

    if (["localhost", "127.0.0.1"].includes(url.hostname) && !["localhost", "127.0.0.1"].includes(currentHost)) {
      url.hostname = currentHost;
    }

    return `${url.toString().replace(/\/$/, "")}${path}`;
  } catch {
    return `${baseUrl}${path}`;
  }
};

const currentReturnTo = () => {
  if (typeof window === "undefined") {
    return "/app";
  }

  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
};

export const authService = {
  getMe: () => apiClient.request<AuthMeResponse>("/me"),
  signup: (request: SignupRequest) => apiClient.request<SignupResponse>("/signup", "POST", request),
  createLoginUrl: (provider: AuthProvider) => {
    const url = new URL(resolveApiUrl("/auth/login"));
    url.searchParams.set("provider", provider);
    url.searchParams.set("returnTo", currentReturnTo());

    return url.toString();
  }
};
