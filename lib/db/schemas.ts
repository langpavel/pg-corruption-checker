import type postgres from "postgresjs";

/**
 * Get a list of all schemas in the database
 */
export async function getSchemas(
  db: postgres.Sql<any>,
): Promise<string[]> {
  const result =
    await db`SELECT nspname FROM pg_catalog.pg_namespace ORDER BY nspname`;
  return result.map((row) => row.nspname);
}
