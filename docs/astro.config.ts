import starlight from "@astrojs/starlight";
import { defineConfig } from "@theholocron/astro-config";
import clientsConfig from "@theholocron/clients-docs";
import { docsTheme } from "@theholocron/docs-theme";

export default defineConfig({
	docs: clientsConfig,
	importMetaUrl: import.meta.url,
	starlight,
	docsTheme,
});
