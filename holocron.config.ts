import type { HolocronConfig } from "@theholocron/cli";
import { defineConfig } from "@theholocron/cli";
import { compose, nodeDocs, wikiCapability as wiki } from "@theholocron/holocron-config";

const preset = compose(nodeDocs(), wiki());
export default defineConfig({
	...preset,
	description: "API clients and shared HTTP primitives.",
	homepage: "https://docs.theholocron.dev/clients/",
	repo: {
		...preset.repo,
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
	tasks: [
		...preset.tasks,
		{ name: "audit", required: true },
		{ name: "release", with: { "run-build": true } },
		"sync",
	],
	extraRequiredChecks: [
		...preset.extraRequiredChecks,
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
	],
	providers: {
		...preset.providers,
		secrets: "github",
		dns: "cloudflare",
		deployment: ["cloudflare", { accountId: "9c558af98664d13fc89b7e0a0d93d5a8" }],
		wiki: ["fern", { domain: "wiki.theholocron.dev", fernOrg: "holocron", icon: "fa-duotone fa-plug" }],
	},
	agent: "claude",
	skills: ["git-safety", "pr-workflow", "commit-standards", "security-review", "holocron-skill-client", "turborepo"],
} satisfies HolocronConfig);
