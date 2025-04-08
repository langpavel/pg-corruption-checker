# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Commands

- `deno task dev`: Run with watch mode
- `deno task check`: Run the DB check tool
- `deno task test`: Run all tests
- `deno test --allow-net --allow-env --allow-read <file_path>`: Run a single
  test
- `deno fmt`: Format code
- `deno lint`: Lint code
- `deno check mod.ts cli.ts pgpass.ts`: Type-check all files

## Project Structure

- `mod.ts`: Core database checking functionality
- `cli.ts`: Command-line interface with psql-like options
- `pgpass.ts`: Utilities for reading passwords from ~/.pgpass file

## Style Guidelines

- **Imports**: Use import maps in deno.json for all external dependencies
- **External Dependencies**: All standard library modules are imported via
  @std/* JSR imports
- **Formatting**: Use 2-space indentation, semicolons, double quotes
- **Types**: Use explicit types for function parameters and return values
- **Naming**: Use camelCase for variables/functions, PascalCase for
  classes/types
- **Error Handling**: Use try/catch blocks with proper error typing
- **Comments**: Document complex logic and exported functions
- no unneeded comments
