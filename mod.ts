import { main as cliMain } from "./lib/cli.ts";
import { 
  connectAndCheck,
  type ConnectionOptions,
  buildConnectionString,
  createConnection,
  checkConnection
} from "./lib/db.ts";

// Re-export the types and functions from lib/db.ts
export type { ConnectionOptions };
export { buildConnectionString, createConnection, checkConnection };

/**
 * Main check function - connects to database, checks connection and closes it
 */
export const check = connectAndCheck;

// Execute CLI when run directly
if (import.meta.main) {
  const result = await cliMain();
  Deno.exit(result ? 0 : 1);
}
