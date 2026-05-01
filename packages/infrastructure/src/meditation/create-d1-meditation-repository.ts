import type { MeditationRepository } from "@harness/application";
import type { CreateMeditationInput, Meditation } from "@harness/domain";
import type { D1Database } from "../database/d1-database";

const meditationSchema = `
CREATE TABLE IF NOT EXISTS meditations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_meditations_user_date ON meditations(user_id, date);
`;

export const createD1MeditationRepository = (database: D1Database): MeditationRepository => {
  const ensureSchema = async () => {
    await database.exec(meditationSchema);
  };

  return {
    createMeditation: async (input: CreateMeditationInput) => {
      await ensureSchema();

      const meditation: Meditation = {
        id: crypto.randomUUID(),
        userId: input.userId,
        content: input.content,
        date: input.date,
        createdAt: new Date().toISOString()
      };

      await database
        .prepare(
          `INSERT INTO meditations (id, user_id, content, date, created_at)
           VALUES (?, ?, ?, ?, ?)`
        )
        .bind(meditation.id, meditation.userId, meditation.content, meditation.date, meditation.createdAt)
        .run();

      return meditation;
    }
  };
};
