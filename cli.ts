import { bold, yellow } from "@std/fmt/colors";
import { parseArgs } from "@std/cli";
import { check, ConnectionOptions } from "./mod.ts";
import { findPassword, checkPgPassPermissions } from "./pgpass.ts";

function printUsage() {
  console.log(bold("Usage:"));
  console.log("  deno run --allow-net --allow-env --allow-read cli.ts [OPTIONS]");
  console.log("\nConnection options:");
  console.log("  -h, --host=HOSTNAME      Database server host");
  console.log("  -p, --port=PORT          Database server port");
  console.log("  -d, --dbname=DBNAME      Database name");
  console.log("  -U, --username=USERNAME  Database user name");
  console.log("  -W, --password=PASSWORD  Database password (can be loaded from ~/.pgpass)");
  console.log("  -c, --connection=STRING  Connection string (overrides other options)");
  console.log("\nOther options:");
  console.log("  --help                   Show this help message");
  console.log("  -v, --version            Show program version");
  console.log("\nPassword management:");
  console.log("  If no password is provided, the tool will try to load it from");
  console.log("  the ~/.pgpass file, following the same rules as psql.");
}

// Main CLI entry point
if (import.meta.main) {
  const args = parseArgs(Deno.args, {
    string: ["host", "port", "dbname", "username", "password", "connection"],
    boolean: ["help", "version"],
    alias: {
      h: "host",
      p: "port",
      d: "dbname",
      U: "username",
      W: "password",
      c: "connection",
      v: "version"
    }
  });
  
  if (args.help) {
    printUsage();
    Deno.exit(0);
  }
  
  if (args.version) {
    console.log("TimescaleDB Corruption Checker version 1.0.0");
    Deno.exit(0);
  }
  
  // Use connection string if provided
  if (args.connection) {
    await check(args.connection);
    Deno.exit(0);
  }
  
  // Prepare connection options
  const options: ConnectionOptions = {
    host: args.host,
    port: args.port ? Number(args.port) : undefined,
    database: args.dbname,
    username: args.username,
    password: args.password,
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
        console.log(yellow("Info: Password loaded from pgpass file"));
        options.password = password;
      }
    } else {
      console.log(yellow("Info: pgpass file exists but has incorrect permissions. Should be 0600."));
    }
  }
  
  await check(options);
}