import starlight from "@astrojs/starlight";
import { defineConfig } from "@theholocron/astro-config";
import { docsTheme } from "@theholocron/docs-theme";

export default defineConfig({
	docs: {
		name: "Clients",
		github: "clients",
		sidebar: [
			{ label: "Overview", slug: "" },
			{
				label: "Packages",
				items: [
					{ label: "Clerk", slug: "clerk" },
					{ label: "Cloudflare", slug: "cloudflare" },
					{ label: "Confluence", slug: "confluence" },
					{ label: "Doppler", slug: "doppler" },
					{ label: "GitHub", slug: "github" },
					{ label: "Google", slug: "google" },
					{ label: "HTTP (base)", slug: "http" },
					{ label: "Infisical", slug: "infisical" },
					{ label: "Jira", slug: "jira" },
					{ label: "Neon", slug: "neon" },
					{ label: "PostHog", slug: "posthog" },
					{ label: "Postman", slug: "postman" },
					{ label: "Sentry", slug: "sentry" },
					{ label: "Vercel", slug: "vercel" },
					{ label: "Zendesk", slug: "zendesk" },
				],
			},
		],
	},
	starlight,
	docsTheme,
	srcDir: "./docs/src",
	outDir: "./docs/dist",
	publicDir: "./docs/public",
});
