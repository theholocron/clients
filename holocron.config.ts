import type { HolocronConfig } from "@theholocron/cli";
import { defineConfig } from "@theholocron/cli";
import { node } from "@theholocron/holocron-config";

const { repo, workflows, providers } = node();
export default defineConfig({
	description: "API clients and shared HTTP primitives.",
	homepage: "https://docs.theholocron.dev/clients/",
	repo: {
		...repo,
		protection: "strict",
		requiredChecks: [
			"audit / Audit the bundle size",
			"audit / Knip",
			"codecov/patch",
			"codecov/patch/clerk-client",
			"codecov/patch/cloudflare-client",
			"codecov/patch/confluence-client",
			"codecov/patch/doppler-client",
			"codecov/patch/github-client",
			"codecov/patch/google-client",
			"codecov/patch/http-client",
			"codecov/patch/infisical-client",
			"codecov/patch/jira-client",
			"codecov/patch/neon-client",
			"codecov/patch/posthog-client",
			"codecov/patch/postman-client",
			"codecov/patch/sentry-client",
			"codecov/patch/vercel-client",
			"codecov/patch/zendesk-client",
			"codecov/project",
		],
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
		"sync",
		{ name: "deploy", with: { docs: true } },
	],
	providers: {
		...providers,
		secrets: "github",
	},
	agent: "claude",
	skills: ["git-safety", "pr-workflow", "commit-standards", "security-review", "holocron-skill-client", "turborepo"],
} satisfies HolocronConfig);
