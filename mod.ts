// deno-lint-ignore-file no-explicit-any
import postgres from "postgresjs";
import { red, green, yellow } from "@std/fmt/colors";

export type ConnectionOptions = {
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
};

export async function checkDB(db: postgres.Sql<any>) {
  const result = await db`SELECT 1`;
  if (result[0][0] !== 1) {
    throw new Error("Database check failed: Cannot query database");
  }
}

export async function getVersionInfo(db: postgres.Sql<any>) {
  return await db`SELECT version()`;
}

export function buildConnectionString(options: ConnectionOptions): string {
  const parts: string[] = [];
  
  if (options.host) parts.push(`host=${options.host}`);
  if (options.port) parts.push(`port=${options.port}`);
  if (options.database) parts.push(`dbname=${options.database}`);
  if (options.username) parts.push(`user=${options.username}`);
  if (options.password) parts.push(`password=${options.password}`);
  
  return parts.join(" ");
}

export async function check(options: ConnectionOptions | string = {}) {
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
        password: options.password
      });
    } else {
      // Use default connection from environment variables
      db = postgres();
    }
  }
  
  try {
    await checkDB(db);
    const versionInfo = await getVersionInfo(db);
    console.log(green("✓ Connection successful"));
    console.log(yellow(`Server version: ${versionInfo[0].version}`));
    return true;
  } catch (error: any) {
    console.error(red(`ERROR: ${error.message}`));
    return false;
  } finally {
    await db.end();
  }
}