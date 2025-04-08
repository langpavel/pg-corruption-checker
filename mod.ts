import { main } from "./lib/cli.ts";
import {
  checkConnection,
  connectAndCheck,
  type ConnectionOptions,
  createConnection,
} from "./lib/db.ts";

// Re-export the types and functions from lib/db.ts
export type { ConnectionOptions };
export { checkConnection, createConnection };

/**
 * Main check function - connects to database, checks connection and closes it
 */
export const check = connectAndCheck;

// Execute CLI when run directly
if (import.meta.main) {
  const result = await main();
  Deno.exit(result ? 0 : 1);
}
