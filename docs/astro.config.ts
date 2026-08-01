import { defineConfig } from "@theholocron/astro-config";
import clientsConfig from "@theholocron/clients-docs";

export default defineConfig({
	docs: clientsConfig,
	importMetaUrl: import.meta.url,
});
