import { defineConfig } from "@theholocron/cli";
import type { HolocronConfig } from "@theholocron/cli";
import { theholocronNode } from "@theholocron/holocron-config";

const defaults = theholocronNode();
export default defineConfig({
	project: {
		name: "clients",
		description:
			"API clients and shared HTTP primitives for theholocron tooling.",
		repo: "theholocron/clients",
		repoPolicy: defaults.repoPolicy,
		workflows: [
			...defaults.workflows,
			"audit",
			{ name: "release", with: { "run-build": true } },
		],
	},
	providers: {
		...defaults.providers,
		secrets: "github",
	},
} satisfies HolocronConfig);
