import { exists } from "@std/fs";
import { join } from "@std/path";
import { error } from "./log.ts";

/**
 * Represents a password entry from the .pgpass file
 */
export interface PgPassEntry {
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
}

/**
 * Gets the default location for the .pgpass file
 * Similar to how psql locates it
 */
export function getPgPassPath(): string {
  const home = Deno.env.get("HOME") || Deno.env.get("USERPROFILE") || "";

  // Check if PGPASSFILE environment variable is set
  const pgpassEnv = Deno.env.get("PGPASSFILE");
  if (pgpassEnv) {
    return pgpassEnv;
  }

  // Default location is ~/.pgpass
  return join(home, ".pgpass");
}

/**
 * Parses a line from the .pgpass file
 * Format: hostname:port:database:username:password
 */
export function parsePgPassLine(line: string): PgPassEntry | null {
  // Skip comments and empty lines
  if (line.startsWith("#") || line.trim() === "") {
    return null;
  }

  const parts = line.split(":");
  if (parts.length !== 5) {
    return null;
  }

  return {
    host: parts[0],
    port: parts[1],
    database: parts[2],
    username: parts[3],
    password: parts[4],
  };
}

/**
 * Checks if a pgpass entry matches the given connection details
 * Uses wildcards (*) as per pgpass specification
 */
function matchesPgPass(
  entry: PgPassEntry,
  host: string,
  port: string | number,
  database: string,
  username: string,
): boolean {
  const portStr = typeof port === "number" ? port.toString() : port;

  return (
    (entry.host === "*" || entry.host === host) &&
    (entry.port === "*" || entry.port === portStr) &&
    (entry.database === "*" || entry.database === database) &&
    (entry.username === "*" || entry.username === username)
  );
}

/**
 * Reads the .pgpass file and finds a matching password
 */
export async function findPassword(
  host: string = "localhost",
  port: string | number = 5432,
  database: string = "",
  username: string = "",
): Promise<string | null> {
  const pgpassPath = getPgPassPath();

  // Check if the file exists
  if (!await exists(pgpassPath)) {
    return null;
  }

  try {
    // Read the file and process it line by line
    const content = await Deno.readTextFile(pgpassPath);
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
      const entry = parsePgPassLine(line);
      if (!entry) continue;

      if (matchesPgPass(entry, host, port, database, username)) {
        return entry.password;
      }
    }

    return null;
  } catch (err) {
    error(
      `Error reading pgpass file: ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
    return null;
  }
}

/**
 * Checks the file permissions of the .pgpass file
 * As per psql, it should have 0600 permissions (readable only by the user)
 * Returns true if permissions are ok, false otherwise
 */
export async function checkPgPassPermissions(): Promise<boolean> {
  const pgpassPath = getPgPassPath();

  // Check if the file exists
  if (!await exists(pgpassPath)) {
    return false;
  }

  try {
    const fileInfo = await Deno.stat(pgpassPath);
    // Deno doesn't provide a direct way to check unix permissions
    // This is a workaround to check if the file mode ends with 600
    const mode = fileInfo.mode?.toString(8);
    return mode ? mode.endsWith("600") : false;
  } catch {
    return false;
  }
}
