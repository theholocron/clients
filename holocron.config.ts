import { defineConfig } from "@theholocron/cli";
import type { HolocronConfig } from "@theholocron/cli";
import { node } from "@theholocron/holocron-config";

const { repo, workflows, providers } = node();
export default defineConfig({
	description: "API clients and shared HTTP primitives for theholocron tooling.",
	repo: {
		...repo,
		topics: [
			"api",
			"api-client",
			"client",
			"confluence",
			"google",
			"http-client",
			"jira",
			"nodejs",
			"rest",
			"typescript",
			"zendesk",
		],
	},
	workflows: [
		...workflows,
		"audit",
		{ name: "release", with: { "run-build": true } },
	],
	providers: {
		...providers,
		secrets: "github",
	},
} satisfies HolocronConfig);
