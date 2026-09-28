#!/usr/bin/env node
// Guards against a tsdown/rolldown race (holocron#762 investigation) where
// deps.neverBundle silently fails to externalize a package's dependency
// tree under a cold pnpm install, inlining everything instead (~4KB legit
// output vs. 27MB observed in CI). Every package here builds a thin client
// wrapper -- nothing legitimate should ever approach this threshold.
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST_DIR = "dist";
const MAX_BYTES = 512_000; // 500KB -- ~12x the largest real output seen (github-client, ~41KB)

let files;
try {
	files = readdirSync(DIST_DIR).filter((name) => name.endsWith(".mjs"));
} catch (error) {
	if (error.code === "ENOENT") {
		console.error(`check-bundle-size: no ${DIST_DIR}/ directory -- build did not produce output`);
		process.exit(1);
	}
	throw error;
}

let failed = false;
for (const file of files) {
	const path = join(DIST_DIR, file);
	const { size } = statSync(path);
	if (size > MAX_BYTES) {
		console.error(
			`check-bundle-size: ${path} is ${(size / 1_000_000).toFixed(2)}MB, exceeding the ${(MAX_BYTES / 1000).toFixed(0)}KB threshold -- ` +
				`a dependency likely failed to externalize (deps.neverBundle) and got inlined instead. Refs: holocron#762`
		);
		failed = true;
	}
}

if (failed) {
	process.exit(1);
}
