import { parseArgs } from "@std/cli";
import { check, ConnectionOptions } from "./mod.ts";
import { findPassword, checkPgPassPermissions } from "./utils/pgpass.ts";
import { info, title, debug } from "./utils/log.ts";

function printUsage() {
  title("Usage:");
  console.log("  deno run --allow-net --allow-env --allow-read cli.ts [OPTIONS] [DBNAME]");
  
  console.log("\nConnection options:");
  console.log("  -h, --host=HOSTNAME      Database server host");
  console.log("  -p, --port=PORT          Database server port");
  console.log("  -d, --dbname=DBNAME      Database name (can also be provided as positional argument)");
  console.log("  -U, --username=USERNAME  Database user name");
  console.log("  -W, --password=PASSWORD  Database password (can be loaded from ~/.pgpass)");
  console.log("  -c, --connection=STRING  Connection string (overrides other options)");
  
  console.log("\nOther options:");
  console.log("  --help                   Show this help message");
  console.log("  -v, --version            Show program version");
  
  console.log("\nPassword management:");
  console.log("  If no password is provided, the tool will try to load it from");
  console.log("  the ~/.pgpass file, following the same rules as psql.");
  
  console.log("\nExamples:");
  console.log("  deno run -A cli.ts -h localhost -p 5432 -U postgres mydb");
  console.log("  deno run -A cli.ts -h localhost -U postgres -d mydb");
}

// Main CLI entry point
if (import.meta.main) {
  const {
    _: positionalArgs, // Capture positional arguments
    ...namedArgs
  } = parseArgs(Deno.args, {
    string: ["host", "port", "dbname", "username", "password", "connection"],
    boolean: ["help", "version"],
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
    Deno.exit(0);
  }

  if (namedArgs.version) {
    debug("TimescaleDB Corruption Checker version 1.0.0");
    Deno.exit(0);
  }

  // Use connection string if provided
  if (namedArgs.connection) {
    await check(namedArgs.connection);
    Deno.exit(0);
  }

  // Get database name from positional argument if provided
  const dbname =
    positionalArgs.length > 0
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
        options.username
      );

      if (password) {
        options.password = password;
      }
    } else {
      info("pgpass file exists but has incorrect permissions. Should be 0600.");
    }
  }

  await check(options);
}
