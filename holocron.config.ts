import { defineConfig } from "@theholocron/cli";

export default defineConfig({
	project: {
		name: "clients",
		description:
			"API clients and shared HTTP primitives for theholocron tooling.",
		repo: "theholocron/clients",
		repoPolicy: {
			preset: "strict",
		},
		workflows: [
			"lint",
			"test",
			"typecheck",
			"codeql",
			"review",
			"audit",
			{ name: "release", with: { "run-build": true } },
			"dependencies",
			"bookkeeping-pr",
			"stale",
			"greetings",
		],
	},
	providers: {
		source: "github",
		ci: "github",
		secrets: "github",
		issues: [
			"github",
			{
				labels: {
					inProgress: "status:in-progress",
					inReview: "status:in-review",
				},
			},
		],
	},
});
