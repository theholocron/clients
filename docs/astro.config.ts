import starlight from "@astrojs/starlight";
import { docsTheme } from "@theholocron/docs-theme";
import { defineConfig } from "@theholocron/astro-config";
import clientsConfig from "@theholocron/clients-docs";

export default defineConfig({
	docs: clientsConfig,
	importMetaUrl: import.meta.url,
	starlight,
	docsTheme,
});
