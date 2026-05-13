# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@keysdown/form-wrapper` is a zero-dependency, framework-agnostic form state management library for JavaScript/TypeScript. It provides form field management, plugin-based validation with customizable error messages, and collection-based error/message/rule management. Published as ES, CJS, UMD for core; ES and CJS for plugins.

## Build & Development Commands

```bash
npm run build          # TypeScript check (tsc) + Vite core build + Vite plugins build
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

- `Form` (`src/core/Form.ts`) — Main class. Uses dynamic property assignment (`[key: string]: any`) to allow direct field access (e.g., `form.username`). Most methods return `this` for chaining. Delegates validation to a `Validation` instance. Has a **static `rules` registry** (`Form.rules`) shared across all instances. Provides `Form.extend(plugin)` and `Form.addRule(name, handler)` static methods for the plugin system.

- `Validation` (`src/core/Validation.ts`) — Container holding three collection instances: `Errors`, `Messages`, `Rules`.

- `Collection<T>` (`src/utils/collections.ts`) — Generic base class for key-value collections with methods: `all()`, `first()`, `any()`, `fill()`, `push()`, `has()`, `get()`, `unset()`, `clear()`.

- `Errors` / `Messages` / `Rules` (`src/core/`) — Specialized collection classes extending `Collection`.

**Plugin system:**

- `formValidation` (`src/plugins/formValidation.ts`) — Plugin that registers all 33 validation rules via `FormWrapper.extend(formValidation)`.
- Individual rules (`src/plugins/rules/*.ts`) — Each rule is a single file with a default export function. This enables tree-shaking at the consumer level.
- `src/plugins/rules/index.ts` — Barrel file with named exports and `allRules` aggregate object.
- Locales (`src/plugins/locales/`) — `en.ts`, `pt.ts`, `es.ts` with default error messages for all 33 rules. Messages support interpolation (`:field`, `:min`, `:max`, `:other`, `:values`). Set via `FormWrapper.locale(locale)`.

**Rule function signature:** `(value: any, attributes: string[], form?: any, field?: string) => Promise<any>` — The third `form` parameter enables cross-field validation (e.g., `same`, `different`, `confirmed`, `lessThan`, etc.). Each rule is wrapped with `defineRule()` (from `src/utils/rule.ts`) which adds a `ruleName` property for message lookup when rules are used as function references in the `rules` array.

**Function-based rules:** The `rules` array accepts both strings (`'required'`) and imported function references (`required`). Functions enable tree-shaking — the bundler only includes imported rules. Use `defineRule()` when creating custom rules to ensure proper message lookup.

**Rule parser:** In `validateField()`, rules are parsed using `indexOf(':')` to split only on the first colon (supports regex patterns with colons like `regex:/^test:pattern$/`).

**Field declaration pattern:** Fields can be simple values (`null`, `'hello'`) or objects with validation config (`{ value: null, validation: { rules: ['required'], messages: { required: 'msg' } } }`). The `attribute` property customizes the field display name in default messages. The utility `generateFieldDeclaration()` in `src/utils/fields.ts` normalizes these into `FieldDeclaration` objects.

**Key types:** All in `src/types/` — `fields.ts`, `collections.ts`, `messages.ts`, `rules.ts` (includes `ValidationRule`, `RuleString`, `RuleFunction`, `RuleHandler`), `validations.ts`, `values.ts`, `plugin.ts` (`FormWrapperPlugin`), `locale.ts` (`Locale`, `LocaleMessages`).

## Validation Rules (33 total)

`required`, `email`, `url`, `min`, `max`, `between`, `size`, `alpha`, `alphaNumeric`, `string`, `integer`, `numeric`, `array`, `boolean`, `date`, `same`, `different`, `confirmed`, `in`, `notIn`, `regex`, `startsWith`, `endsWith`, `digits`, `digitsBetween`, `ip`, `json`, `uuid`, `lessThan`, `greaterThan`, `lessThanOrEqual`, `greaterThanOrEqual`, `nullable`.

Adding a new rule: create a file in `src/plugins/rules/`, add it to `src/plugins/rules/index.ts` (named export + allRules), add the rule name to the `ValidationRule` union type in `src/types/rules.ts`, create a test file, and update README.md.

## Build Configuration

- **TypeScript:** Strict mode, ESNext target, `noEmit: true` (Vite handles bundling), bundler module resolution.
- **Vite core** (`vite.config.ts`): Library mode, single entry (`src/main.ts`), outputs ES/CJS/UMD.
- **Vite plugins** (`vite.config.plugins.ts`): Library mode, multi-entry (`src/plugins/formValidation.ts` + `src/plugins/rules/index.ts` + `src/plugins/locales/index.ts`), outputs ES/CJS only, `emptyOutDir: false`.
- **package.json exports:** `.` (core), `./plugins/formValidation`, `./plugins/rules`, `./plugins/locales`.

**Nullable rule behavior:** When `nullable` is present in the rules array and the value is `null`, `undefined`, or `''`, validation short-circuits and all subsequent rules are skipped. This applies to both string rules (`'nullable'`) and function rules (imported `nullable`).
