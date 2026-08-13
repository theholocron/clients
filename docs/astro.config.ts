import starlight from "@astrojs/starlight";
import { docsTheme } from "@theholocron/docs-theme";
import { defineConfig } from "astro/config";

export default defineConfig({
	integrations: [
		starlight({
			title: "Clients",
			plugins: [docsTheme()],
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/theholocron/clients",
				},
			],
			sidebar: [
				{ label: "Overview", slug: "" },
				{
					label: "Packages",
					items: [
						{ label: "Clerk", slug: "clerk" },
						{ label: "Confluence", slug: "confluence" },
						{ label: "Doppler", slug: "doppler" },
						{ label: "GitHub", slug: "github" },
						{ label: "Google", slug: "google" },
						{ label: "HTTP (base)", slug: "http" },
						{ label: "Infisical", slug: "infisical" },
						{ label: "Jira", slug: "jira" },
						{ label: "Neon", slug: "neon" },
						{ label: "Postman", slug: "postman" },
						{ label: "Vercel", slug: "vercel" },
						{ label: "Zendesk", slug: "zendesk" },
					],
				},
			],
		}),
	],
});
