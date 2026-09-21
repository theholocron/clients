import type { KnipConfig } from "knip";

const config: KnipConfig = {
	workspaces: {
		".": {
			// prettier.config.ts, eslint.config.ts, release.config.ts, commitlint.config.ts auto-detected by Knip plugins
			entry: ["holocron.config.ts", "astromech.config.ts", "docs/src/content.config.ts"],
			project: ["*.ts", "docs/src/**/*.ts"],
			// astro.config.ts is the docs build config, not an Astro workspace — disable plugin
			astro: false,
		},
		"packages/*": {
			// entry points auto-detected from package.json exports
			// vitest.config.ts re-exports a shared bundle so Knip can't trace
			// the include patterns — declare test entry points explicitly
			entry: ["src/__tests__/**/*.test.ts"],
			project: ["src/**/*.ts"],
		},
		"packages/confluence-client": {
			entry: ["src/__tests__/**/*.test.ts", "examples.ts"],
			project: ["src/**/*.ts"],
		},
		"packages/zendesk-client": {
			entry: ["src/__tests__/**/*.test.ts", "examples.ts"],
			project: ["src/**/*.ts"],
		},
	},
	ignoreDependencies: [
		// Loaded at runtime by the holocron plugin system — not a static import
		"@theholocron/holocron-plugin-cloudflare",
		"@theholocron/holocron-plugin-fern",
		"@theholocron/holocron-plugin-github",
		// Used by the skills runtime, not a module import
		"@theholocron/skills",
		// tsconfig.json "extends" — not a module import
		"@theholocron/tsconfig",
		// resolved by astromech's CLI --config splice from node_modules, not a
		// module import — root commitlint.config.ts was removed as redundant
		// (epic #672 Phase 5); CI's platform.commitStandards.yml already points
		// --config at this package's built dist/index.js explicitly
		"@theholocron/commitlint-config",
		// resolved by astromech's CLI --config splice from node_modules, not a
		// module import — root prettier.config.ts removed as redundant (same)
		"@theholocron/prettier-config",
		// resolved by astromech's CLI --config splice from node_modules, not a
		// module import — per-package vitest.config.ts files removed as
		// redundant, same mechanism (epic #672 Phase 5)
		"@theholocron/vitest-config",
		// pinned as a pnpm override; not directly imported by root code
		"@commitlint/config-conventional",
		// passed as --config arg to lint-staged binary in .husky/pre-commit
		"@theholocron/lint-staged-config",
		// loaded by devmoji.config.cjs via require() — file is in ignoreFiles so Knip can't trace it
		"@theholocron/devmoji-config",
		// binary tools — invoked via CLI or hooks, not module imports
		"alexjs",
		// invoked by @theholocron/lint-staged-config tasks, not a direct import
		"sort-package-json",
		// @theholocron/astro-config's defineConfig() wires react() into the Astro
		// integrations list internally — a required peer dep, but astro.config.ts
		// never imports it directly, so Knip can't trace the usage
		"@astrojs/react",
	],
	ignoreExportsUsedInFile: true,
};

export default config;
