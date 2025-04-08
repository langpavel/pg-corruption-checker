import type { ConnectionOptions } from "./types.ts";
import { createConnection } from "./createConnection.ts";
import { checkConnection } from "./checkConnection.ts";
import { getSchemas } from "./schemas.ts";
import { info } from "../log.ts";

/**
 * Connect to database, check connection and close it
 */
export async function check(
  options: ConnectionOptions | string = {},
): Promise<void> {
  const db = createConnection(options);

  try {
    await checkConnection(db);
    const schemas = await getSchemas(db);
    for (const schema of schemas) {
      info(`Schema: ${schema}`);
      const tables =
        await db`SELECT table_name FROM information_schema.tables WHERE table_schema = ${schema}`;
      for (const table of tables) {
        console.log(`  Table: ${table.table_name}`);
      }
    }
  } finally {
    await db.end();
  }
}
