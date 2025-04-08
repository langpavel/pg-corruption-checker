import { bold } from "@std/fmt/colors";
import { parseArgs } from "@std/cli";
import { check } from "./mod.ts";

function printUsage() {
  console.log(bold("Usage:"));
  console.log("  deno run --allow-net --allow-env --allow-read cli.ts [OPTIONS]");
  console.log("\nConnection options:");
  console.log("  -h, --host=HOSTNAME      Database server host");
  console.log("  -p, --port=PORT          Database server port");
  console.log("  -d, --dbname=DBNAME      Database name");
  console.log("  -U, --username=USERNAME  Database user name");
  console.log("  -W, --password=PASSWORD  Database password");
  console.log("  -c, --connection=STRING  Connection string (overrides other options)");
  console.log("\nOther options:");
  console.log("  --help                   Show this help message");
  console.log("  -v, --version            Show program version");
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
  
  if (args.connection) {
    await check(args.connection);
  } else {
    await check({
      host: args.host,
      port: args.port ? Number(args.port) : undefined,
      database: args.dbname,
      username: args.username,
      password: args.password,
    });
  }
}