import { bold, brightBlue, gray, green, red, yellow } from "@std/fmt/colors";

/**
 * Log an error message in red
 */
export function error(fmt: string, ...args: unknown[]): void {
  console.error(`${red(`E ${fmt}`)}`, ...args);
}

/**
 * Log a success message in green
 */
export function success(fmt: string, ...args: unknown[]): void {
  console.info(`${bold(green(`✓ ${fmt}`))}`, ...args);
}

/**
 * Log an informational message
 */
export function warn(fmt: string, ...args: unknown[]): void {
  console.warn(`${yellow(`! ${fmt}`)}`, ...args);
}

/**
 * Log an informational message
 */
export function info(fmt: string, ...args: unknown[]): void {
  console.info(`${brightBlue("i")} ${fmt}`, ...args);
}

/**
 * Log a debug message
 */
export function debug(fmt: string, ...args: unknown[]): void {
  console.debug(`${gray("·")} ${fmt}`, ...args);
}

/**
 * Log a title/header in bold
 */
export function title(fmt: string, ...args: unknown[]): void {
  console.info(bold(`# ${fmt}`), ...args);
}
