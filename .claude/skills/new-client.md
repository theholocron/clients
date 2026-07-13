---
name: new-client
description: Scaffold a new @theholocron/<slug>-client package in this monorepo.
---

<!-- editorconfig-checker-disable-file -->

# Scaffold a new client package

Replace `<slug>` with the vendor name in kebab-case (e.g. `slack`, `zendesk`),
`<Vendor>` with PascalCase (e.g. `Slack`, `Zendesk`), and `<BASE_URL>` with
the API root (e.g. `https://slack.com/api`).

---

## 1. Register in the workspace

Add to `pnpm-workspace.yaml`:

```yaml
packages:
  - packages/<slug>-client
```

Then run `pnpm install` from the repo root to hoist shared devDeps.

---

## 2. Config files (identical across all clients)

**`packages/<slug>-client/package.json`**

```json
{
  "name": "@theholocron/<slug>-client",
  "version": "0.0.0",
  "description": "A TypeScript client for the <Vendor> API",
  "homepage": "https://github.com/theholocron/clients/tree/main/packages/<slug>-client#readme",
  "bugs": "https://github.com/theholocron/clients/issues",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/theholocron/clients.git",
    "directory": "packages/<slug>-client"
  },
  "license": "GPL-3.0",
  "author": "Newton Koumantzelis",
  "type": "module",
  "main": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "build": "tsdown",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@theholocron/eslint-config": "catalog:",
    "@theholocron/tsconfig": "catalog:",
    "@theholocron/tsdown-config": "catalog:",
    "@theholocron/vitest-config": "catalog:",
    "@vitest/coverage-v8": "catalog:",
    "@vitest/eslint-plugin": "catalog:",
    "eslint": "catalog:",
    "eslint-plugin-n": "catalog:",
    "globals": "catalog:",
    "tsdown": "catalog:",
    "typescript": "catalog:",
    "vitest": "catalog:"
  },
  "publishConfig": {
    "access": "public",
    "main": "./dist/index.mjs",
    "types": "./dist/index.d.mts",
    "exports": {
      ".": {
        "types": "./dist/index.d.mts",
        "import": "./dist/index.mjs",
        "default": "./dist/index.mjs"
      }
    }
  },
  "files": ["dist", "README.md"],
  "engines": { "node": ">=22.0.0" },
  "releases": "https://github.com/theholocron/clients/releases"
}
```

**`packages/<slug>-client/tsconfig.json`**

```json
{
  "display": "<Vendor> API Client",
  "extends": "@theholocron/tsconfig/node-lts",
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

**`packages/<slug>-client/vitest.config.ts`**

```ts
export { default } from "@theholocron/vitest-config/bundles/library";
```

**`packages/<slug>-client/tsdown.config.ts`**

```ts
export { default } from "@theholocron/tsdown-config/presets/library";
```

**`packages/<slug>-client/eslint.config.js`**

```js
import { library } from "@theholocron/eslint-config/bundles/library";

/** @type {import("eslint").Linter.Config} */
const config = [
	...library(),
	{
		rules: {
			// src/ compiles to dist/ via tsdown; files[] lists dist/ so every
			// relative src/ import is flagged as unpublished. False positive
			// for the TypeScript src→dist build model.
			"n/no-unpublished-import": "off",
		},
	},
	{ ignores: ["dist/**", "coverage/**"] },
];

export default config;
```

---

## 3. Source files

### `src/types.ts` — API response types

Define one interface per entity the API returns. Keep them flat; nest only
when the API structure demands it.

```ts
export interface <Vendor>ClientOptions {
	// token: string           — for API key / bearer
	// host?: string           — if the base URL is per-tenant
}

export interface <Vendor>Thing {
	id: string;
	// ...
}
```

### `src/client.ts` — HTTP helpers (API key / bearer auth)

Use this pattern for any vendor with a static token. For OAuth see §4.

```ts
import type { <Vendor>ClientOptions } from "./types.js";

export function buildHeaders(token: string): Record<string, string> {
	return {
		Accept: "application/json",
		Authorization: `Bearer ${token}`,   // or Basic, or Token, etc.
		"Content-Type": "application/json",
	};
}

export function buildUrl(
	options: <Vendor>ClientOptions,
	path: string,
	params?: Record<string, unknown>,
): string {
	const url = new URL(`<BASE_URL>${path}`);
	if (params) {
		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined) url.searchParams.set(key, String(value));
		}
	}
	return url.toString();
}

export async function request<T>(url: string, init: RequestInit): Promise<T> {
	const response = await fetch(url, init);
	if (!response.ok) {
		throw new Error(`<Vendor> API error ${response.status}: ${response.statusText}`);
	}
	if (response.status === 204 || response.headers.get("content-length") === "0") {
		return undefined as T;
	}
	return response.json() as Promise<T>;
}
```

### `src/<resource>.ts` — one file per API resource group

```ts
import { buildHeaders, buildUrl, request } from "./client.js";
import type { <Vendor>ClientOptions, <Vendor>Thing } from "./types.js";

export function <resources>(options: <Vendor>ClientOptions) {
	const headers = buildHeaders(options.token);

	return {
		get(id: string): Promise<<Vendor>Thing> {
			return request<<Vendor>Thing>(buildUrl(options, `/<resources>/${id}`), {
				method: "GET",
				headers,
			});
		},

		create(payload: Partial<<Vendor>Thing>): Promise<<Vendor>Thing> {
			return request<<Vendor>Thing>(buildUrl(options, `/<resources>/`), {
				method: "POST",
				headers,
				body: JSON.stringify(payload),
			});
		},

		// add more methods as needed
	};
}
```

### `src/index.ts` — factory + public API

```ts
import { <resources> } from "./<resources>.js";

export type * from "./types.js";
export type { <resources> };

export function create<Vendor>Client(options: { token: string }) {
	return {
		<resources>: <resources>(options),
		// add more resource groups here
	};
}
```

---

## 4. OAuth variant

Use this when the vendor requires OAuth 2.0 instead of a static token (see
`packages/google-client/src/authentication.ts` for a full example).

Add runtime dependencies:

```bash
pnpm --filter @theholocron/<slug>-client add <oauth-library>
```

Create `src/auth.ts` with `buildClient(scopes)` → returns an authenticated
client. Export it from `index.ts` alongside the resource factory. Do **not**
use `src/client.ts`'s `buildHeaders` helper for OAuth — the SDK handles
headers internally.

---

## 5. Tests

**`src/__tests__/client.test.ts`**

All tests go in one file per package; use `describe` blocks per resource group.
Stub `fetch` globally — no real HTTP calls in tests.

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { create<Vendor>Client } from "../index.js";

const TOKEN = "test-token";

function mockFetch(responses: Array<{ status?: number; body?: unknown }>) {
	const calls: Array<{ url: string; method: string; body: unknown }> = [];
	let i = 0;
	return {
		mock: vi.fn(async (url: string, init?: RequestInit) => {
			const body = typeof init?.body === "string" ? JSON.parse(init.body) : null;
			calls.push({ url, method: (init?.method ?? "GET").toUpperCase(), body });
			const next = responses[i++] ?? { status: 200, body: {} };
			const status = next.status ?? 200;
			if (status === 204) return new Response(null, { status });
			return new Response(JSON.stringify(next.body ?? {}), { status });
		}),
		calls,
	};
}

let stub: ReturnType<typeof mockFetch>;

beforeEach(() => {
	stub = mockFetch([]);
	vi.stubGlobal("fetch", stub.mock);
});

afterEach(() => { vi.unstubAllGlobals(); });

const client = create<Vendor>Client({ token: TOKEN });

describe("<resources>", () => {
	it("gets a <resource> via GET /<resources>/:id", async () => {
		stub = mockFetch([{ body: { id: "1" } }]);
		vi.stubGlobal("fetch", stub.mock);
		await client.<resources>.get("1");
		expect(stub.calls[0]?.method).toBe("GET");
		expect(stub.calls[0]?.url).toContain("/<resources>/1");
	});

	it("sends Authorization header", async () => {
		stub = mockFetch([{ body: { id: "1" } }]);
		vi.stubGlobal("fetch", stub.mock);
		await client.<resources>.get("1");
		const headers = (stub.mock.mock.calls[0]?.[1]?.headers ?? {}) as Record<string, string>;
		expect(headers["Authorization"]).toBe(`Bearer ${TOKEN}`);
	});

	it("creates a <resource> via POST /<resources>/", async () => {
		stub = mockFetch([{ status: 201, body: { id: "2" } }]);
		vi.stubGlobal("fetch", stub.mock);
		await client.<resources>.create({ /* payload */ });
		expect(stub.calls[0]?.method).toBe("POST");
		expect(stub.calls[0]?.url).toContain("/<resources>/");
	});

	it("returns undefined on 204", async () => {
		stub = mockFetch([{ status: 204 }]);
		vi.stubGlobal("fetch", stub.mock);
		const result = await client.<resources>.create({});
		expect(result).toBeUndefined();
	});
});
```

---

## 6. README.md

```md
# `@theholocron/<slug>-client`

TypeScript client for the [<Vendor> API](<vendor-docs-url>).

## Install

\`\`\`bash
pnpm add @theholocron/<slug>-client
\`\`\`

## Usage

\`\`\`ts
import { create<Vendor>Client } from "@theholocron/<slug>-client";

const client = create<Vendor>Client({ token: process.env.<VENDOR>_TOKEN! });
const thing = await client.<resources>.get("id");
\`\`\`

## Status

`v0.0.0` — published on npm. APIs may shift before v1.
```

---

## 7. Checklist before opening a PR

- [ ] `pnpm install` — workspace symlink created
- [ ] `pnpm --filter @theholocron/<slug>-client typecheck` — passes
- [ ] `pnpm --filter @theholocron/<slug>-client lint` — passes
- [ ] `pnpm --filter @theholocron/<slug>-client test` — all tests pass
- [ ] `pnpm --filter @theholocron/<slug>-client build` — `dist/` emitted
- [ ] Auth header variant matches the vendor's actual scheme (Bearer / Basic / Token / custom)
- [ ] `src/types.ts` covers every shape returned or accepted by the implemented methods
- [ ] `README.md` has a working usage example
- [ ] Run `holocron setup` after adding the package so `.alexrc.json` stays current

## 8. First publish

New packages need a one-time manual publish before OIDC Trusted Publishing
takes over. See `docs/self-hosting.md` (or the root `README.md`) for the
`holocron npm publish-initial` workflow.
