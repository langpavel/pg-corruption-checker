import { red, green, yellow, bold } from "@std/fmt/colors";

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
 * Log an informational message in yellow
 */
export function info(message: string): void {
  console.log(yellow(`Info: ${message}`));
}

/**
 * Log a debug message (no color)
 */
export function debug(message: string): void {
  console.log(message);
}

/**
 * Log a title/header in bold
 */
export function title(message: string): void {
  console.log(bold(message));
}

/**
 * Log the database version information
 */
export function version(version: string): void {
  console.log(yellow(`Server version: ${version}`));
}