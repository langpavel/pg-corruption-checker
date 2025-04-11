import postgres from "postgresjs";
import { debug } from "../log.ts";

/**
 * @see https://github.com/porsager/postgres?tab=readme-ov-file#all-postgres-options
 */
export type ConnectionOptions<
  T extends Record<string, postgres.PostgresType> = Record<
    string,
    postgres.PostgresType
  >,
> = postgres.Options<T> | string;

/**
 * Create a database connection from options or connection string
 */
export const createConnection: (options: ConnectionOptions) => postgres.Sql = (
  options,
) => {
  const onnotice = (notice: postgres.Notice) => {
    const { severity, code, message } = notice;
    debug(`  ${severity} (${code}): ${message}`);
    // severity: "DEBUG",
    // severity_local: "DEBUG",
    // code: "00000",
    // message: "bind <unnamed> to lu2mwcz8go4",
    // file: "postgres.c",
    // line: "1657",
    // routine: "exec_bind_message"
  };

  if (typeof options === "object" && options !== null) {
    return postgres({
      ...options,
      max: 1,
      max_lifetime: 60 * 60 * 24, // in seconds
      onnotice,
      connection: {
        ...options.connection,
        application_name: "pg-corruption-checker",
        client_min_messages: "debug5",
      },
    });
  }
  return postgres(options as string, {
    max: 1,
    onnotice,
    connection: {
      application_name: "pg-corruption-checker",
    },
  });
};
