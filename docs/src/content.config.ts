import clientsConfig from "@theholocron/clients-docs";
import { createDocsCollections } from "@theholocron/docs-theme/content";

export const collections = createDocsCollections(
	clientsConfig,
	import.meta.url,
);
