import { parseArgs } from "@std/cli";
import { check } from "./db/check.ts";
import type { ConnectionOptions } from "./db/createConnection.ts";
import { checkPgPassPermissions, findPassword } from "./pgpass.ts";
import { info, warn } from "./log.ts";
import { printUsage } from "./printUsage.ts";
import pkg from "../deno.json" with { type: "json" };

/**
 * CLI main entry point
 */
export async function main(args: string[] = Deno.args): Promise<void> {
  const {
    _: positionalArgs, // Capture positional arguments
    ...namedArgs
  } = parseArgs(args, {
    string: ["host", "port", "dbname", "username", "password", "connection"],
    boolean: ["help", "version", "no-analyze"],
    alias: {
      h: "host",
      p: "port",
      d: "dbname",
      U: "username",
      W: "password",
      c: "connection",
      v: "version",
    },
  });

  if (namedArgs.help) {
    printUsage();
    return;
  }

  if (namedArgs.version) {
    info(`PostgreSQL/TimescaleDB Corruption Checker v${pkg.version}`);
    return;
  }

  // Use connection string if provided
  if (namedArgs.connection) {
    await check(namedArgs.connection, { skipAnalyze: namedArgs["no-analyze"] });
    return;
  }

  // Get database name from positional argument if provided
  const dbname = positionalArgs.length > 0
    ? String(positionalArgs[0]) // First positional argument is dbname
    : namedArgs.dbname; // Fall back to named argument

  // Prepare connection options
  const options: ConnectionOptions = {
    host: namedArgs.host,
    port: namedArgs.port ? Number(namedArgs.port) : undefined,
    database: dbname, // Use the database name from positional or named argument
    username: namedArgs.username,
    password: namedArgs.password,
  };

  // If password not provided, try to find it in pgpass file
  if (!options.password && options.host && options.username) {
    const permissionsOk = await checkPgPassPermissions();

    if (permissionsOk) {
      const password = await findPassword(
        options.host,
        options.port || 5432,
        options.database || "",
        options.username,
      );

      if (password) {
        options.password = password;
      }
    } else {
      warn("pgpass file exists but has incorrect permissions. Should be 0600.");
    }
  }

  await check(options, { skipAnalyze: namedArgs["no-analyze"] });
  return;
}
