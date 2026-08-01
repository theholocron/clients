import { fileURLToPath } from "node:url";

import { docsSchema } from "@astrojs/starlight/schema";
import clientsConfig from "@theholocron/clients-docs";
import { createDocsLoader } from "@theholocron/docs-theme/loader";
import { defineCollection } from "astro:content";

const REPO_SLUG = clientsConfig.slug;

function localSlug(configSlug: string): string {
	if (configSlug === REPO_SLUG) return "";
	if (configSlug.startsWith(`${REPO_SLUG}/`))
		return configSlug.slice(REPO_SLUG.length + 1);
	return configSlug;
}

export const collections = {
	docs: defineCollection({
		loader: createDocsLoader([
			{
				dir: fileURLToPath(
					new URL(
						"../../packages/clients-docs/content",
						import.meta.url,
					),
				),
				slug: localSlug(clientsConfig.slug),
			},
		]),
		schema: docsSchema(),
	}),
};
