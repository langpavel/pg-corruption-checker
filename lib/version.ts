// deno-lint-ignore-file no-explicit-any
import type postgres from "postgresjs";

/**
 * Get version information from PostgreSQL database
 */
export async function getVersionInfo(
  db: postgres.Sql<any>,
): Promise<Record<string, string>> {
  const result = await db`SELECT version()`;

  // Extract version string from PostgreSQL result
  const versionString = result[0]?.version || "";

  // Return version info as a record
  return {
    "PostgreSQL": versionString,
  };
}

/**
 * Format version information as a string
 */
export function formatVersionInfo(versions: Record<string, string>): string {
  return Object.entries(versions)
    .map(([name, version]) => `${name} ${version}`)
    .join("\n");
}
