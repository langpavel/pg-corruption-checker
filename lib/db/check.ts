import type { Sql } from "postgresjs";

import { error, info, success, title } from "../log.ts";

import {
  type ConnectionOptions,
  createConnection,
} from "./createConnection.ts";
import { checkConnection } from "./checkConnection.ts";
import type postgres from "postgresjs";
import { debug } from "node:console";

/**
 * Get a list of all schemas in the database
 */
export async function getSchemas(sql: Sql): Promise<{ schemaName: string }[]> {
  return await sql`SELECT nspname AS "schemaName" FROM pg_catalog.pg_namespace ORDER BY nspname`;
}

/**
 * Get a list of all tables in the database schema
 */
export async function getTables(
  sql: Sql,
  schema: string,
): Promise<{ tableName: string }[]> {
  return await sql`SELECT table_name AS "tableName" FROM information_schema.tables WHERE table_schema = ${schema}`;
}

export const EXPLAIN_ANALYZE =
  "EXPLAIN (ANALYZE, VERBOSE, SETTINGS, BUFFERS, SERIALIZE TEXT, WAL, TIMING, MEMORY, FORMAT JSON)";

/**
 * Check if a table can be queried
 */
export async function checkTable(
  options: ConnectionOptions,
  schema: string,
  tableName: string,
): Promise<void> {
  const sql = createConnection(options);
  try {
    {
      title(`${schema}.${tableName}`);
      info(`Explain (simple)`);

      const explainShort = await sql`EXPLAIN SELECT * FROM ${sql(schema)}.${
        sql(tableName)
      }`;
      for (const line of explainShort) {
        debug("  " + line["QUERY PLAN"]);
      }

      info(`Explain analyze`);

      const pendingQuery = sql`${sql.unsafe(EXPLAIN_ANALYZE)} SELECT * FROM ${
        sql(schema)
      }.${sql(tableName)}`.execute();

      let terminateWorkReject: (reason?: Error) => void;
      const terminateWork = new Promise<postgres.Row[]>((_, reject) => {
        terminateWorkReject = reject;
      });

      const handleTerminate = () => {
        pendingQuery.cancel();
        setTimeout(
          () => terminateWorkReject(new Error("User terminated")),
          100,
        );
      };

      Deno.addSignalListener("SIGINT", handleTerminate);
      try {
        const result = await Promise.race([pendingQuery, terminateWork]);
        for (const line of result) {
          info("  " + JSON.stringify(line["QUERY PLAN"]));
        }
        success(`- ${schema}.${tableName}`);
      } finally {
        Deno.removeSignalListener("SIGINT", handleTerminate);
      }
    }
  } catch (e) {
    error(`- ${schema}.${tableName} - ${e}`);
  } finally {
    sql.end();
  }
}

/**
 * Connect to database, check connection and close it
 */
export async function check(options: ConnectionOptions = {}): Promise<void> {
  const sql = createConnection(options);

  try {
    await checkConnection(sql);
    const schemas = await getSchemas(sql);
    for (const { schemaName } of schemas) {
      {
        const tables = await getTables(sql, schemaName);
        for (const { tableName } of tables) {
          await checkTable(options, schemaName, tableName);
        }
      }
    }
  } finally {
    await sql.end();
  }
}
