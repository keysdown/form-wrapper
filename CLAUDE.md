# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@keysdown/form-wrapper` is a zero-dependency, framework-agnostic form state management library for JavaScript/TypeScript. It provides form field management, validation with customizable error messages, and collection-based error/message/rule management. Published as ES, CJS, UMD, and IIFE formats.

## Build & Development Commands

```bash
npm run build          # TypeScript check (tsc) + Vite bundle
npm run dev            # Vite dev server with HMR
npm run preview        # Preview production build
npm run test           # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
```

## Testing

Tests use **Vitest** with `@vitest/coverage-v8`. Every code change must maintain **100% code coverage** across statements, branches, functions, and lines. Test files live in `tests/` mirroring the `src/` structure.

```bash
npm run test:coverage  # Verify 100% coverage before committing
```

## Documentation

Every code or functionality change must be reflected in `README.md`. This includes new methods, changed signatures, updated behavior, or new features.

## Architecture

**Entry point:** `src/main.ts` exports `createForm()` (factory) and `FormWrapper` (default class export).

**Core class hierarchy:**

- `Form` (`src/core/Form.ts`) — Main class. Uses dynamic property assignment (`[key: string]: any`) to allow direct field access (e.g., `form.username`). Most methods return `this` for chaining. Delegates validation to a `Validation` instance.

- `Validation` (`src/core/Validation.ts`) — Container holding three collection instances: `Errors`, `Messages`, `Rules`.

- `Collection<T>` (`src/utils/collections.ts`) — Generic base class for key-value collections with methods: `all()`, `first()`, `any()`, `fill()`, `push()`, `has()`, `get()`, `unset()`, `clear()`.

- `Errors` / `Messages` / `Rules` (`src/core/`) — Specialized collection classes extending `Collection`.

**Field declaration pattern:** Fields can be simple values (`null`, `'hello'`) or objects with validation config (`{ value: null, rules: ['required'], messages: { required: 'msg' } }`). The utility `generateFieldDeclaration()` in `src/utils/fields.ts` normalizes these into `FieldDeclaration` objects.

**Validation rules:** Defined in `src/utils/validations.ts` as a `Rule` registry (record of rule-name → async validator function). Rules support colon-separated parameters (e.g., `'min:6'`). Currently only `required` is implemented. Adding a new rule means adding an entry to the `Rule` object.

**Key types:** All in `src/types/` — `fields.ts`, `collections.ts`, `messages.ts`, `rules.ts`, `validations.ts`, `values.ts`.

## Build Configuration

- **TypeScript:** Strict mode, ESNext target, `noEmit: true` (Vite handles bundling), bundler module resolution.
- **Vite:** Library mode with `vite-plugin-dts` for `.d.ts` generation. Outputs to `dist/` in four formats. Named exports only.
