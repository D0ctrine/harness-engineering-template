export interface D1RunResult {
  success: boolean;
  meta?: {
    last_row_id?: number;
  };
}

export interface D1PreparedStatement {
  bind: (...values: unknown[]) => D1PreparedStatement;
  first: <T = Record<string, unknown>>() => Promise<T | null>;
  run: () => Promise<D1RunResult>;
}

export interface D1Database {
  prepare: (query: string) => D1PreparedStatement;
  exec: (query: string) => Promise<unknown>;
}
