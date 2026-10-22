/**
 * DEPRECATED: this file exists only because the GitHub Actions
 * "Static Analysis / Run eslint and actionlint" workflow needs a real,
 * on-disk eslint.config.ts to run `eslint .` against. Sentinel's own
 * static-analysis check (theholocron/holocron#860) already runs the
 * identical library() bundle in-memory, with no local file at all, and is
 * now merge-blocking for error-severity findings (theholocron/holocron#873)
 * -- the same guarantee this GH Actions job provides today.
 *
 * Once that GH Actions job is retired in favor of Sentinel's own check
 * (actionlint -- a separate, unrelated tool bundled into the same job today
 * -- needs splitting into its own check first), this file goes away
 * entirely: no repo needs a local eslint.config.ts once nothing runs
 * `eslint .` for real anymore.
 */
import { library } from "@theholocron/eslint-config/bundles/library";
import type { Linter } from "eslint";

const config = [
	...library(),
	{
		files: ["docs/src/**"],
		rules: {
			// docs/src imports live in root package.json, not docs/package.json
			"n/no-extraneous-import": "off",
		},
	},
	{
		ignores: ["packages/*/dist/**", "packages/*/coverage/**", "**/node_modules/**"],
	},
] satisfies Linter.Config[];

export default config;
