import { bold, green, red } from "@std/fmt/colors";

/**
 * Log an error message in red
 */
export function error(message: string): void {
  console.error(red(`ERROR: ${message}`));
}

/**
 * Log a success message in green
 */
export function success(message: string): void {
  console.log(green(`✓ ${message}`));
}

/**
 * Log an informational message
 */
export function info(...args: unknown[]): void {
  console.info(...args);
}

/**
 * Log a debug message
 */
export function debug(...args: unknown[]): void {
  console.debug(...args);
}

/**
 * Log a title/header in bold
 */
export function title(message: string): void {
  console.log(bold(message));
}
