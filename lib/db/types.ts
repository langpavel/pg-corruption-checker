import type postgres from "postgresjs";

export type ConnectionOptions = {
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
};

// Re-export the postgres Sql type for use in other modules
export type { postgres };
