import { main } from "./lib/cli.ts";
import { checkConnection } from "./lib/db/checkConnection.ts";
import { check } from "./lib/db/check.ts";
import { createConnection } from "./lib/db/createConnection.ts";
import { getSchemas } from "./lib/db/check.ts";
import type { ConnectionOptions } from "./lib/db/createConnection.ts";

// Re-export the types and functions
export type { ConnectionOptions };
export {
  check as connectAndCheck,
  checkConnection,
  createConnection,
  getSchemas,
};

// Execute CLI when run directly
if (import.meta.main) {
  await main(Deno.args);
}
