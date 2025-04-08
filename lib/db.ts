// deno-lint-ignore-file no-explicit-any
import postgres from "postgresjs";
import { error, info } from "./log.ts";

export type ConnectionOptions = {
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
};

/**
 * Create a database connection from options or connection string
 */
export function createConnection(
  options: ConnectionOptions | string = {},
): postgres.Sql<any> {
  if (typeof options === "string") {
    return options ? postgres(options) : postgres();
  } else {
    // If options object has properties, use it directly
    if (Object.keys(options).length > 0) {
      return postgres({
        host: options.host,
        port: options.port,
        database: options.database,
        username: options.username,
        password: options.password,
      });
    } else {
      // Use default connection from environment variables
      return postgres();
    }
  }
}

/**
 * Check database connection and get version information
 */
export async function checkConnection(db: postgres.Sql<any>): Promise<boolean> {
  try {
    const result = await db`SELECT version()`;
    info("Server version:", result[0].version);
    return true;
  } catch (err: any) {
    error(err.message);
    return false;
  }
}

/**
 * Connect to database, check connection and close it
 */
export async function connectAndCheck(
  options: ConnectionOptions | string = {},
): Promise<boolean> {
  const db = createConnection(options);

  try {
    return await checkConnection(db);
  } finally {
    await db.end();
  }
}
