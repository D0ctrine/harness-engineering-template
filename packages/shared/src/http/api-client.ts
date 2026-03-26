export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}

export class EnterpriseApiClient {
  constructor(private readonly baseUrl: string) {}

  async request<T>(path: string, method: HttpMethod = "GET", body?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
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
}
