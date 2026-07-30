import { docsTheme } from "@theholocron/docs-theme";
import clientsConfig from "@theholocron/clients-docs";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://theholocron.github.io",
	base: "/clients",
	integrations: [
		starlight({
			title: clientsConfig.name,
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
					items: [{ autogenerate: { directory: "." } }],
				},
			],
		}),
	],
});
