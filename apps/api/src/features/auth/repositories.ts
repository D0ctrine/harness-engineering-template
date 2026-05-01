import {
  createD1MeditationRepository,
  createD1UserAccountRepository,
  type D1Database
} from "@harness/infrastructure";

export class DatabaseBindingMissingError extends Error {
  constructor() {
    super("Cloudflare D1 DB binding is not configured.");
    this.name = "DatabaseBindingMissingError";
  }
}

export const requireD1Database = (database: D1Database | undefined) => {
  if (!database) {
    throw new DatabaseBindingMissingError();
  }

  return database;
};

export const createUserRepository = (database: D1Database | undefined) =>
  createD1UserAccountRepository(requireD1Database(database));

export const createMeditationRepository = (database: D1Database | undefined) =>
  createD1MeditationRepository(requireD1Database(database));
