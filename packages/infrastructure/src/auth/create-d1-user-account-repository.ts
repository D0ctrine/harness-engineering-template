import type { UserAccountRepository } from "@harness/application";
import type { AuthProvider, CreateUserAccountInput, UserAccount } from "@harness/domain";
import type { D1Database } from "../database/d1-database";

interface UserAccountRow {
  id: string;
  provider: AuthProvider;
  provider_id: string;
  name: string;
  age: number;
  church: string | null;
  has_no_church: number;
  created_at: string;
}

const userSchema = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  church TEXT,
  has_no_church INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  UNIQUE(provider, provider_id)
);
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider, provider_id);
`;

const toUserAccount = (row: UserAccountRow): UserAccount => ({
  id: row.id,
  provider: row.provider,
  providerId: row.provider_id,
  name: row.name,
  age: Number(row.age),
  church: row.church,
  hasNoChurch: row.has_no_church === 1,
  createdAt: row.created_at
});

export const createD1UserAccountRepository = (database: D1Database): UserAccountRepository => {
  const ensureSchema = async () => {
    await database.exec(userSchema);
  };

  return {
    findUserById: async (userId) => {
      await ensureSchema();

      const row = await database
        .prepare(
          `SELECT id, provider, provider_id, name, age, church, has_no_church, created_at
           FROM users
           WHERE id = ?`
        )
        .bind(userId)
        .first<UserAccountRow>();

      return row ? toUserAccount(row) : null;
    },
    findUserByProvider: async (provider, providerId) => {
      await ensureSchema();

      const row = await database
        .prepare(
          `SELECT id, provider, provider_id, name, age, church, has_no_church, created_at
           FROM users
           WHERE provider = ? AND provider_id = ?`
        )
        .bind(provider, providerId)
        .first<UserAccountRow>();

      return row ? toUserAccount(row) : null;
    },
    createUser: async (input: CreateUserAccountInput) => {
      await ensureSchema();

      const now = new Date().toISOString();
      const user: UserAccount = {
        id: crypto.randomUUID(),
        provider: input.provider,
        providerId: input.providerId,
        name: input.name,
        age: input.age,
        church: input.church,
        hasNoChurch: input.hasNoChurch,
        createdAt: now
      };

      await database
        .prepare(
          `INSERT INTO users (id, provider, provider_id, name, age, church, has_no_church, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          user.id,
          user.provider,
          user.providerId,
          user.name,
          user.age,
          user.church,
          user.hasNoChurch ? 1 : 0,
          user.createdAt
        )
        .run();

      return user;
    }
  };
};
