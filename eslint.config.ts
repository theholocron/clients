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
