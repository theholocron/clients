import type { Loader, LoaderContext } from "astro/loaders";
import matter from "gray-matter";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

export interface WorkspaceDocsSource {
	/** Absolute path to the content directory. */
	dir: string;
	/**
	 * Slug prefix for content entries in this directory.
	 * For a per-repo shell, strip the repo prefix first.
	 * Empty string maps the package root to the site root.
	 */
	slug: string;
}

const EXTENSIONS = new Set([".md", ".mdx"]);

async function* walk(dir: string): AsyncGenerator<string> {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		if (entry.name.startsWith("_")) continue;
		const full = join(dir, entry.name);
		if (entry.isDirectory()) yield* walk(full);
		else if (EXTENSIONS.has(extname(entry.name))) yield full;
	}
}

function computeId(
	filePath: string,
	baseDir: string,
	slugPrefix: string,
): string {
	const rel = relative(baseDir, filePath).replace(/\\/g, "/");
	const noExt = rel.replace(/\.(mdx?)$/, "");
	// Strip trailing /index and bare "index" to collapse to the prefix
	const noIndex = noExt.replace(/\/index$/, "").replace(/^index$/, "");
	if (noIndex) {
		// Non-index file: prefix/path or just path when prefix is root
		return slugPrefix ? `${slugPrefix}/${noIndex}` : noIndex;
	}
	// Index file: use prefix, or "index" when prefix is root (empty string ID is invalid)
	return slugPrefix || "index";
}

/**
 * Loads Markdown/MDX files from multiple workspace content-package directories
 * into a single Starlight docs collection. Uses a single clear-then-repopulate
 * strategy so sequential sources don't clobber each other's entries.
 */
export function workspaceDocsLoader(sources: WorkspaceDocsSource[]): Loader {
	return {
		name: "workspace-docs-loader",
		async load(ctx: LoaderContext) {
			ctx.store.clear();
			const siteRoot = fileURLToPath(ctx.config.root);

			for (const { dir, slug: slugPrefix } of sources) {
				for await (const absPath of walk(dir)) {
					const id = computeId(absPath, dir, slugPrefix);
					const raw = readFileSync(absPath, "utf-8");
					const { data: frontmatter, content: body } = matter(raw);
					const digest = createHash("sha256")
						.update(raw)
						.digest("hex")
						.slice(0, 8);
					// Astro requires filePath to be relative to the site root (no leading /)
					const filePath = relative(siteRoot, absPath);
					const data = await ctx.parseData({
						id,
						data: frontmatter,
						filePath,
					});
					ctx.store.set({ id, data, body, filePath, digest });
					ctx.watcher?.add(absPath);
				}
			}
		},
	};
}
