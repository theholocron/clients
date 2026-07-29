<<<<<<< HEAD
import { docsTheme } from "@theholocron/docs-theme";
import clientsConfig from "@theholocron/clients-docs";
import githubConfig from "@theholocron/github-client-docs";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://theholocron.github.io",
	base: "/clients",
	integrations: [
		starlight({
			title: clientsConfig.name,
			plugins: [docsTheme()],
||||||| parent of ae1cc02 (feat: add docs/ Astro + Starlight shell (step 3 of docs architecture))
=======
import clientsConfig from "@theholocron/clients-docs";
import githubConfig from "@theholocron/github-client-docs";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// TODO: add plugins: [docsTheme()] once @theholocron/docs-theme is republished with dist/
// import { docsTheme } from "@theholocron/docs-theme";

export default defineConfig({
	site: "https://theholocron.github.io",
	base: "/clients",
	integrations: [
		starlight({
			title: clientsConfig.name,
>>>>>>> ae1cc02 (feat: add docs/ Astro + Starlight shell (step 3 of docs architecture))
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
					items: [{ label: githubConfig.name, slug: "github" }],
				},
			],
		}),
	],
});
