import type { ConnectionOptions } from "./types.ts";
import { createConnection } from "./createConnection.ts";
import { checkConnection } from "./checkConnection.ts";
import { getSchemas } from "./schemas.ts";
import { error, spinner, success } from "../log.ts";

/**
 * Connect to database, check connection and close it
 */
export async function check(
  options: ConnectionOptions | string = {},
): Promise<void> {
  const sql = createConnection(options);

  try {
    await checkConnection(sql);
    const schemas = await getSchemas(sql);
    for (const schema of schemas) {
      {
        const tables =
          await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = ${schema}`;
        for (const table of tables) {
          try {
            {
              using s = spinner({
                message:
                  `EXPLAIN SELECT * FROM ${schema}.${table.table_name} ... `,
              });

              await sql`EXPLAIN SELECT * FROM ${sql(schema)}.${
                sql(table.table_name)
              } LIMIT 1`;

              s.message =
                `EXPLAIN (ANALYZE, SERIALIZE TEXT) SELECT * ${schema}.${table.table_name} ... `;

              await sql`EXPLAIN (ANALYZE, SERIALIZE TEXT) SELECT * FROM ${
                sql(schema)
              }.${sql(table.table_name)} LIMIT 1`;
            }
            success(`- ${schema}.${table.table_name}`);
          } catch (e) {
            error(`- ${schema}.${table.table_name} - ${e}`);
          }
        }
      }
    }
  } finally {
    await sql.end();
  }
}
