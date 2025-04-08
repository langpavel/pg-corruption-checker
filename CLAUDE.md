# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Commands

- `deno task dev`: Run with watch mode
- `deno task run`: Run the CLI tool
- `deno task test`: Run all tests
- `deno test --allow-net --allow-env --allow-read <file_path>`: Run a single test
- `deno fmt`: Format code
- `deno lint`: Lint code
- `deno check mod.ts lib/**/*.ts`: Type-check all files

## Project Structure

- `mod.ts`: Main entry point (dual-use as library and CLI)
- `lib/cli.ts`: CLI parsing and command handling logic
- `lib/db.ts`: Database connection and interaction logic
- `lib/log.ts`: Logging utilities
- `lib/pgpass.ts`: Utilities for reading passwords from ~/.pgpass file
- `lib/version.ts`: Version information handling

## Design Patterns

- **Dual-use approach**: The main module can be imported as a library or run directly as a CLI
- **import.meta.main pattern**: Used to detect when the module is run directly vs imported

## Style Guidelines

- **Imports**: Use import maps in deno.json for all external dependencies
- **External Dependencies**: All standard library modules are imported via @std/* JSR imports
- **Formatting**: Use 2-space indentation, semicolons, double quotes
- **Types**: Use explicit types for function parameters and return values
- **Naming**: Use camelCase for variables/functions, PascalCase for classes/types
- **Error Handling**: Use try/catch blocks with proper error typing
- **Comments**: Document complex logic and exported functions
- No unneeded comments
- No classes with static methods, prefer functional approach

## Commit Message Guidelines

Follow semantic commit message format:

- `feat:` - New feature (MINOR version bump)
- `fix:` - Bug fix (PATCH version bump)
- `feat!:` or containing `BREAKING CHANGE:` - Breaking API change (MAJOR version bump)
- `docs:` - Documentation updates only
- `style:` - Code style changes (formatting, missing semicolons, etc)
- `refactor:` - Code changes that neither fix bugs nor add features
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Changes to the build process, tooling, etc
