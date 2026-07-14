---
name: new-client
description: Scaffold a new @theholocron/<slug>-client package in this monorepo.
---

<!-- editorconfig-checker-disable-file -->

# Scaffold a new client package

Replace `<slug>` with the vendor name in kebab-case (e.g. `slack`, `stripe`),
`<Vendor>` with PascalCase (e.g. `Slack`, `Stripe`), and `<BASE_URL>` with
the API root (e.g. `https://api.stripe.com`).

Reference implementation: `packages/zendesk-client` (the canonical example
of the current patterns — `createRestClient`, `stubFetch`, DI fetch).

---

## 1. Register in the workspace

Add to `pnpm-workspace.yaml`:

```yaml
packages:
    - packages/<slug>-client
```

Then run `pnpm install` from the repo root.

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
  "exports": { ".": "./src/index.ts" },
  "scripts": {
    "build": "tsdown",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@theholocron/http-client": "^0.1.0"
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
  "compilerOptions": { "baseUrl": "./", "outDir": "./dist" },
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

```ts
export interface <Vendor>Thing {
  id: string;
  // ...
}
```

### `src/client.ts` — REST client factory

Use `createRestClient` from `@theholocron/http-client`. Pass `fetch` through
for dependency injection (required for testing without global stubs).

```ts
import { createRestClient, type RestClient } from "@theholocron/http-client";

export interface <Vendor>ClientOptions {
  /** API token / key. */
  token: string;
  /** Override fetch for testing. Defaults to globalThis.fetch. */
  fetch?: typeof fetch;
}

export function create<Vendor>RestClient(opts: <Vendor>ClientOptions): RestClient {
  return createRestClient({
    baseUrl: "<BASE_URL>",
    token: opts.token,
    vendor: "<Vendor>",
    fetch: opts.fetch,
  });
}
```

If the vendor uses Basic auth or a non-Bearer scheme, add a token-building
helper here (see `packages/zendesk-client/src/utils.ts` for an example with
`createToken`).

### `src/<resource>.ts` — one file per API resource group

Resource functions receive a `RestClient` instance — no direct fetch calls.

```ts
import type { RestClient } from "@theholocron/http-client";
import type { <Vendor>Thing } from "./types.js";

export function <resources>(rest: RestClient) {
  return {
    get(id: string): Promise<<Vendor>Thing> {
      return rest.request<<Vendor>Thing>(`/<resources>/${id}`);
    },

    create(payload: Partial<<Vendor>Thing>): Promise<<Vendor>Thing> {
      return rest.request<<Vendor>Thing>("/<resources>/", {
        method: "POST",
        body: payload,
      });
    },

    // add more methods as needed
    // delete: (id: string) => rest.request<void>(`/<resources>/${id}`, { method: "DELETE", expectNoContent: true }),
  };
}
```

### `src/index.ts` — factory + public API

```ts
import { create<Vendor>RestClient, type <Vendor>ClientOptions } from "./client.js";
import { <resources> } from "./<resources>.js";

export type { <Vendor>ClientOptions } from "./client.js";
export type * from "./types.js";

export function create<Vendor>Client(opts: <Vendor>ClientOptions) {
  const rest = create<Vendor>RestClient(opts);
  return {
    <resources>: <resources>(rest),
    // add more resource groups here
  };
}
```

---

## 4. OAuth variant

Use this only when the vendor requires OAuth 2.0 instead of a static token
(see `packages/google-client/src/authentication.ts` for a full example).

Add the vendor's OAuth library as a runtime dependency:

```bash
pnpm --filter @theholocron/<slug>-client add <oauth-library>
```

Create `src/auth.ts` exporting an async function that returns an authenticated
client or token. Export it from `index.ts` alongside the resource factory.
The `fetch` DI pattern still applies — wire the authenticated client's fetch
through `createRestClient` where possible.

---

## 5. Tests

### `src/__tests__/helpers.ts`

Every package gets its own `stubFetch` — no global stubs.

```ts
import { vi } from "vitest";

export interface FetchCall {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: unknown;
}

export function stubFetch(
  responses: Array<{ status?: number; body?: unknown; text?: string }>,
) {
  const calls: FetchCall[] = [];
  let i = 0;
  const mock = vi.fn(async (input: string | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.toString();
    const body =
      typeof init?.body === "string"
        ? JSON.parse(init.body)
        : (init?.body ?? null);
    calls.push({
      url,
      method: (init?.method ?? "GET").toUpperCase(),
      headers: (init?.headers as Record<string, string>) ?? {},
      body,
    });
    const next = responses[i++] ?? { status: 200, body: {} };
    const status = next.status ?? 200;
    if (status === 204) return new Response(null, { status });
    const text = next.text ?? JSON.stringify(next.body ?? {});
    return new Response(text, { status });
  });
  return { fetch: mock as unknown as typeof fetch, calls };
}
```

### `src/__tests__/client.test.ts`

Inject fetch via the client options — no `vi.stubGlobal`.

```ts
import { describe, expect, it } from "vitest";
import { create<Vendor>Client } from "../index.js";
import { stubFetch } from "./helpers.js";

const TOKEN = "test-token";

function makeClient(responses: Parameters<typeof stubFetch>[0]) {
  const { fetch, calls } = stubFetch(responses);
  const client = create<Vendor>Client({ token: TOKEN, fetch });
  return { client, calls };
}

describe("<resources>", () => {
  it("GET /<resources>/:id", async () => {
    const { client, calls } = makeClient([{ body: { id: "1" } }]);
    await client.<resources>.get("1");
    expect(calls[0]?.method).toBe("GET");
    expect(calls[0]?.url).toContain("/<resources>/1");
  });

  it("sends Authorization header", async () => {
    const { client, calls } = makeClient([{ body: { id: "1" } }]);
    await client.<resources>.get("1");
    expect(calls[0]?.headers.authorization).toBe(`Bearer ${TOKEN}`);
  });

  it("POST /<resources>/", async () => {
    const { client, calls } = makeClient([{ status: 201, body: { id: "2" } }]);
    await client.<resources>.create({ /* payload */ });
    expect(calls[0]?.method).toBe("POST");
  });

  it("returns undefined on 204", async () => {
    const { client, calls } = makeClient([{ status: 204 }]);
    const result = await client.<resources>.create({});
    expect(result).toBeUndefined();
    expect(calls).toHaveLength(1);
  });
});
```

---

## 6. README.md

```md
# `@theholocron/<slug>-client`

TypeScript client for the [<Vendor> API](vendor-docs-url).

## Install

\`\`\`bash
pnpm add @theholocron/<slug>-client
\`\`\`

## Usage

\`\`\`ts
import { create<Vendor>Client } from "@theholocron/<slug>-client";

const client = create<Vendor>Client({ token: process.env.<VENDOR>\_TOKEN! });
const thing = await client.<resources>.get("id");
\`\`\`

## Status

`v0.0.0` — published on npm. APIs may shift before v1.
```

---

## 7. Checklist before opening a PR

- [ ] `pnpm install` — workspace symlink created
- [ ] `pnpm --filter @theholocron/<slug>-client typecheck` passes
- [ ] `pnpm --filter @theholocron/<slug>-client lint` passes
- [ ] `pnpm --filter @theholocron/<slug>-client test` passes
- [ ] `pnpm --filter @theholocron/<slug>-client build` — `dist/` emitted
- [ ] `src/types.ts` covers every shape returned or accepted by implemented methods
- [ ] Auth header scheme matches the vendor's spec (Bearer / Basic / Token / custom)
- [ ] `README.md` has a working usage example
- [ ] Run `holocron setup` so `.alexrc.json` stays current

## 8. First publish

New packages need a one-time manual publish before OIDC Trusted Publishing
takes over. See the root `README.md` for the `holocron npm publish-initial`
workflow.
