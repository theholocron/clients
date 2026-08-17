import { describe, expect, it } from "vitest";

import { createCloudflareClient } from "../index.js";
import { cfOk, stubFetch } from "./helpers.js";

const TOKEN = "cf-test-token";

describe("createCloudflareClient", () => {
	it("sends Bearer authorization header", async () => {
		const { fetch, calls } = stubFetch([cfOk([])]);
		const client = createCloudflareClient({ token: TOKEN, fetch });
		await client.zones.list();
		expect(calls[0]?.headers.authorization).toBe(`Bearer ${TOKEN}`);
	});

	it("targets the Cloudflare v4 base URL", async () => {
		const { fetch, calls } = stubFetch([cfOk([])]);
		const client = createCloudflareClient({ token: TOKEN, fetch });
		await client.zones.list();
		expect(calls[0]?.url).toContain("https://api.cloudflare.com/client/v4");
	});

	it("respects baseUrl override", async () => {
		const { fetch, calls } = stubFetch([cfOk([])]);
		const client = createCloudflareClient({ token: TOKEN, baseUrl: "https://cf.test/client/v4", fetch });
		await client.zones.list();
		expect(calls[0]?.url).toContain("https://cf.test/client/v4");
	});
});
