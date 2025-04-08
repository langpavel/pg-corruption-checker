// deno-lint-ignore-file no-explicit-any
import postgres from "postgresjs";
import type { ConnectionOptions } from "./types.ts";

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
