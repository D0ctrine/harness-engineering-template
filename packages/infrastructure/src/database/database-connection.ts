export interface DatabaseConnection {
  isConnected: boolean;
  connectionString: string;
}

export const createDatabaseConnection = (connectionString: string): DatabaseConnection => ({
  isConnected: true,
  connectionString
});
