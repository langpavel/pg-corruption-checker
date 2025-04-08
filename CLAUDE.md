# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `deno task dev`: Run with watch mode
- `deno task test`: Run all tests
- `deno test --allow-net --allow-env --allow-read <file_path>`: Run a single test
- `deno fmt`: Format code
- `deno lint`: Lint code
- `deno check main.ts`: Type-check main.ts

## Style Guidelines
- **Imports**: Group imports by: standard library (@std/*), then external modules, then local modules
- **Formatting**: Use 2-space indentation, semicolons, double quotes
- **Types**: Use explicit types for function parameters and return values; avoid 'any' where possible
- **Naming**: Use camelCase for variables/functions, PascalCase for classes/types
- **Error Handling**: Use try/catch blocks with proper error typing
- **Async**: Properly await async functions and handle Promise results
- **Comments**: Document complex logic or non-obvious behavior