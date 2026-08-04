import { defineConfig } from "@theholocron/cli";
import type { HolocronConfig } from "@theholocron/cli";
import { node } from "@theholocron/holocron-config";

const { repo, workflows, providers } = node();
export default defineConfig({
	description: "API clients and shared HTTP primitives.",
	homepage: "https://docs.theholocron.dev/clients/",
	repo: {
		...repo,
		teams: [{ slug: "gatekeepers", permission: "maintain" }],
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
		{
			name: "deploy-docs",
			with: { name: "clients" },
			paths: ["packages/clients-docs/**"],
		},
	],
	providers: {
		...providers,
		secrets: "github",
	},
	agent: "claude",
	skills: ["git-safety", "pr-workflow", "commit-standards", "security-review", "holocron-skill-client", "turborepo"],
} satisfies HolocronConfig);
