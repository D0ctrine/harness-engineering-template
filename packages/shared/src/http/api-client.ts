export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}

export class EnterpriseApiClient {
  constructor(private readonly baseUrl: string) {}

  async request<T>(path: string, method: HttpMethod = "GET", body?: unknown): Promise<T> {
    const response = await fetch(`${this.resolveBaseUrl()}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      let details: unknown;
      try {
        details = await response.json();
      } catch {
        details = undefined;
      }

      throw {
        message: `Request failed: ${method} ${path}`,
        status: response.status,
        details
      } as ApiError;
    }

    return response.json() as Promise<T>;
  }

  private resolveBaseUrl() {
    if (typeof window === "undefined") {
      return this.baseUrl;
    }

    const currentHost = window.location.hostname;

    if (["localhost", "127.0.0.1"].includes(currentHost)) {
      return this.baseUrl;
    }

    try {
      const url = new URL(this.baseUrl);

      if (!["localhost", "127.0.0.1"].includes(url.hostname)) {
        return this.baseUrl;
      }

      url.hostname = currentHost;
      return url.toString().replace(/\/$/, "");
    } catch {
      return this.baseUrl;
    }
  }
}
