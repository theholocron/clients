import { defineConfig } from "@theholocron/cli";
import type { HolocronConfig } from "@theholocron/cli";

export default defineConfig({
	project: {
		name: "clients",
		description:
			"API clients and shared HTTP primitives for theholocron tooling.",
		repo: {
			name: "theholocron/clients",
			protection: "strict",
			topics: [
				"api",
				"api-client",
				"client",
				"http-client",
				"nodejs",
				"rest",
				"typescript",
			],
			properties: {
				lifecycle: "active",
				open_source: true,
				runtime_environment: "node",
				uses_external_packages: true,
			},
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
} satisfies HolocronConfig);
