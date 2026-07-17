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
  package's `eslint.config.ts`. This is a known false positive for the
  TypeScript `src/ → dist/` build model — `files[]` in `package.json`
  lists `dist/`, so every relative `src/` import is flagged. Keep the
  rule off at project level; do not push it to the org config.

## Adding a new client package

Use the `.claude/skills/new-client.md` skill. Two steps beyond the
scaffolding that are easy to miss:

1. Add `"packages/<slug>-client"` to the `prepareCmd` array in
   `.releaserc.json` (keep alphabetical order). Omitting this leaves
   the package frozen at its initial version while all others advance.
2. Set the initial `version` in `package.json` to match the current
   lockstep version (check the latest GitHub release tag).

## Quality

- `pnpm test` — vitest across all packages via Turbo.
- `pnpm typecheck` — `tsc --noEmit` in each package.
- `pnpm lint` — ESLint via Turbo.
- Test helpers live in `src/__tests__/helpers.ts` per package (e.g.,
  `stubFetch` for injecting fetch responses without global stubs).
