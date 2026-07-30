import clientsConfig from "@theholocron/clients-docs";
import { docsSchema } from "@astrojs/starlight/schema";
import { defineCollection } from "astro:content";
import { fileURLToPath } from "node:url";
import { workspaceDocsLoader } from "./loaders/workspace-docs.ts";

const REPO_SLUG = clientsConfig.slug; // "clients"

/** Strip the repo-level prefix so entries sit at the site base (/clients/). */
function localSlug(configSlug: string): string {
	if (configSlug === REPO_SLUG) return "";
	if (configSlug.startsWith(`${REPO_SLUG}/`))
		return configSlug.slice(REPO_SLUG.length + 1);
	return configSlug;
}

export const collections = {
	docs: defineCollection({
		loader: workspaceDocsLoader([
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
