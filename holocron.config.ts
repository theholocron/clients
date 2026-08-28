import type { HolocronConfig } from "@theholocron/cli";
import { defineConfig } from "@theholocron/cli";
import { nodeDocs } from "@theholocron/holocron-config";

const { repo, workflows, providers, org, domain, docs } = nodeDocs();
export default defineConfig({
	description: "API clients and shared HTTP primitives.",
	homepage: "https://docs.theholocron.dev/clients/",
	org,
	domain,
	docs,
	repo: {
		...repo,
		requiredChecks: [
			...repo.requiredChecks,
			"audit / Audit the bundle size",
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
	],
	providers: {
		...providers,
		secrets: "github",
		dns: "cloudflare",
		deployment: ["cloudflare", { accountId: "9c558af98664d13fc89b7e0a0d93d5a8" }],
	},
	agent: "claude",
	skills: ["git-safety", "pr-workflow", "commit-standards", "security-review", "holocron-skill-client", "turborepo"],
} satisfies HolocronConfig);
