<!-- editorconfig-checker-disable-file -->

@../github-private/CLAUDE.md

# CLAUDE.md

Conventions for working on the `theholocron/clients` monorepo.

## Architecture

- **pnpm workspace monorepo** with Turborepo for task orchestration.
- Each package under `packages/` is an independently published npm package.
- All packages compile TypeScript source (`src/`) to `dist/` via `tsdown`.
- `@theholocron/http-client` is the canonical home for shared HTTP
  primitives (`createRestClient`, `createResolveToken`, `ProviderApiError`).
  All other clients depend on it.

## Code patterns

- **ESLint override:** `n/no-unpublished-import` is disabled in every
  package's `eslint.config.js`. This is a known false positive for the
  TypeScript `src/ → dist/` build model — `files[]` in `package.json`
  lists `dist/`, so every relative `src/` import is flagged. Keep the
  rule off at project level; do not push it to the org config.

## Quality

- `pnpm test` — vitest across all packages via Turbo.
- `pnpm typecheck` — `tsc --noEmit` in each package.
- `pnpm lint` — ESLint via Turbo.
- Test helpers live in `src/__tests__/helpers.ts` per package (e.g.,
  `stubFetch` for injecting fetch responses without global stubs).
