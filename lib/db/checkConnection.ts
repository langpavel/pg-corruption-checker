// deno-lint-ignore-file no-explicit-any
import type postgres from "postgresjs";
import { error, info } from "../log.ts";

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
