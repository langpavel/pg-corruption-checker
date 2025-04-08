import { title } from "./log.ts";

/**
 * Print CLI usage information
 */

export function printUsage(): void {
  title("Usage:");
  console.log(
    "  deno run --allow-net --allow-env --allow-read jsr:@langpavel/pg-corruption-checker [OPTIONS] [DBNAME]",
  );

  console.log("\nConnection options:");
  console.log("  -h, --host=HOSTNAME      Database server host");
  console.log("  -p, --port=PORT          Database server port");
  console.log(
    "  -d, --dbname=DBNAME      Database name (can also be provided as positional argument)",
  );
  console.log("  -U, --username=USERNAME  Database user name");
  console.log(
    "  -W, --password=PASSWORD  Database password (can be loaded from ~/.pgpass)",
  );
  console.log(
    "  -c, --connection=STRING  Connection string (overrides other options)",
  );

  console.log("\nOther options:");
  console.log("  --help                   Show this help message");
  console.log("  -v, --version            Show program version");

  console.log("\nPassword management:");
  console.log(
    "  If no password is provided, the tool will try to load it from",
  );
  console.log("  the ~/.pgpass file, following the same rules as psql.");

  console.log("\nExamples:");
  console.log(
    "  deno run -A jsr:@langpavel/pg-corruption-checker -h localhost -p 5432 -U postgres mydb",
  );
  console.log(
    "  deno run -A jsr:@langpavel/pg-corruption-checker -h localhost -U postgres -d mydb",
  );
}
