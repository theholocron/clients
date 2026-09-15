import type { HolocronConfig } from "@theholocron/cli";
import { defineConfig } from "@theholocron/cli";

// Intent-facing tasks declared directly instead of spreading a preset
// (epic #672, D13 — same pattern theholocron/holocron's own config uses).
// theholocron/holocron-config's nodeDocs()/wiki() presets still speak the
// pre-decomposition vocabulary (lint/typecheck/test/deploy/wiki) and
// haven't caught up to the vocabulary rename (#675) — this repo doesn't
// wait on that, it just declares what it needs.
export default defineConfig({
	description: "API clients and shared HTTP primitives.",
	homepage: "https://docs.theholocron.dev/clients/",
	org: "theholocron",
	domain: "theholocron.dev",
	docs: { build: "workflow", https: true },
	repo: {
		protection: "strict",
		properties: {
			lifecycle: "active",
			open_source: true,
			runtime_environment: "node",
			uses_external_packages: true,
		},
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
		{ name: "sourceQuality.staticAnalysis", required: true },
		{ name: "sourceQuality.formatting", required: true },
		{ name: "sourceQuality.structuredDataValidation", required: true },
		{ name: "security.secretDetection", required: true },
		{ name: "platform.commitStandards", required: true },
		{ name: "verification.unitTests", required: true },
		"security.codeScanning",
		"review",
		"stale",
		"greetings",
		"dependencies",
		"bookkeeping",
		{ name: "verification.typeSafety", required: true },
		// knowledge.docs implies docs: true — same idiom as theholocron/holocron
		// (no Storybook here either).
		{ name: "knowledge.docs", with: { preview: true } },
		"knowledge.wiki",
	],
	// Task-backed checks (Static Analysis / Test / Typecheck / … Conclusion) are
	// derived from the `{ required: true }` tasks. These are the extras:
	// codecov project-wide gates + one per-package patch gate.
	extraRequiredChecks: [
		"codecov/patch",
		"codecov/project",
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
		source: "github",
		ci: "github",
		issues: [
			"github",
			{
				labels: {
					inProgress: "status:in-progress",
					inReview: "status:in-review",
				},
			},
		],
		secrets: "github",
		dns: "cloudflare",
		deployment: ["cloudflare", { accountId: "9c558af98664d13fc89b7e0a0d93d5a8" }],
		workers: ["cloudflare", { accountId: "9c558af98664d13fc89b7e0a0d93d5a8" }],
		wiki: ["fern", { domain: "wiki.theholocron.dev", fernOrg: "holocron", icon: "fa-duotone fa-plug" }],
	},
	agent: "claude",
	skills: ["git-safety", "pr-workflow", "commit-standards", "security-review", "holocron-skill-client", "turborepo"],
} satisfies HolocronConfig);
