import { createDatabaseConnection } from "./db/database";
import { apiConfig } from "./config/env";
import { createApp } from "./app";

const db = createDatabaseConnection(apiConfig.databaseUrl);

if (!db.isConnected) {
  throw new Error("Database connection failed during boot");
}

const app = createApp();
app.listen(apiConfig.port, () => {
  console.log(`API server listening on :${apiConfig.port}${apiConfig.apiPrefix}`);
});
