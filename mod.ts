// deno-lint-ignore-file no-explicit-any
import postgres from "postgresjs";
import { error, info } from "./utils/log.ts";
import { main as cliMain } from "./lib/cli.ts";

export type ConnectionOptions = {
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
};

export function buildConnectionString(options: ConnectionOptions): string {
  const parts: string[] = [];

  if (options.host) parts.push(`host=${options.host}`);
  if (options.port) parts.push(`port=${options.port}`);
  if (options.database) parts.push(`dbname=${options.database}`);
  if (options.username) parts.push(`user=${options.username}`);
  if (options.password) parts.push(`password=${options.password}`);

  return parts.join(" ");
}

export async function check(
  options: ConnectionOptions | string = {},
): Promise<boolean> {
  let db: postgres.Sql<any>;

  if (typeof options === "string") {
    db = options ? postgres(options) : postgres();
  } else {
    // If options object has properties, use it directly
    if (Object.keys(options).length > 0) {
      db = postgres({
        host: options.host,
        port: options.port,
        database: options.database,
        username: options.username,
        password: options.password,
      });
    } else {
      // Use default connection from environment variables
      db = postgres();
    }
  }

  try {
    const result = await db`SELECT version()`;
    info("Server version:", result[0].version);
    return true;
  } catch (err: any) {
    error(err.message);
    return false;
  } finally {
    await db.end();
  }
}

// Execute CLI when run directly
if (import.meta.main) {
  const result = await cliMain();
  Deno.exit(result ? 0 : 1);
}
