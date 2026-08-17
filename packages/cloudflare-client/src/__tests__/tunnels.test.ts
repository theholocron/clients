import { describe, expect, it } from "vitest";

import { createCloudflareClient } from "../index.js";
import { cfOk, stubFetch } from "./helpers.js";

const BASE = "https://cf.test/client/v4";
const ACCOUNT = "acct-123";
const TUNNEL_ID = "tun-abc";

function client(responses: Parameters<typeof stubFetch>[0]) {
	const { fetch, calls } = stubFetch(responses);
	return { tunnels: createCloudflareClient({ token: "tok", baseUrl: BASE, fetch }).tunnels, calls };
}

describe("tunnels.create", () => {
	it("POSTs to /accounts/{accountId}/cfd_tunnel with config_src", async () => {
		const { tunnels, calls } = client([cfOk({ id: TUNNEL_ID, name: "my-tunnel" })]);
		const result = await tunnels.create(ACCOUNT, { name: "my-tunnel" });
		expect(calls[0]?.method).toBe("POST");
		expect(calls[0]?.url).toContain(`/accounts/${ACCOUNT}/cfd_tunnel`);
		expect(calls[0]?.body).toEqual({ name: "my-tunnel", config_src: "cloudflare" });
		expect(result).toEqual({ id: TUNNEL_ID, name: "my-tunnel" });
	});
});

describe("tunnels.list", () => {
	it("GETs with is_deleted=false", async () => {
		const { tunnels, calls } = client([cfOk([{ id: TUNNEL_ID, name: "my-tunnel" }])]);
		await tunnels.list(ACCOUNT);
		expect(calls[0]?.url).toContain("is_deleted=false");
	});
});

describe("tunnels.token", () => {
	it("GETs the tunnel token", async () => {
		const { tunnels, calls } = client([cfOk("cf-tunnel-secret-token")]);
		const token = await tunnels.token(ACCOUNT, TUNNEL_ID);
		expect(calls[0]?.url).toContain(`/accounts/${ACCOUNT}/cfd_tunnel/${TUNNEL_ID}/token`);
		expect(token).toBe("cf-tunnel-secret-token");
	});
});

describe("tunnels.delete", () => {
	it("DELETEs with cascade=true", async () => {
		const { tunnels, calls } = client([cfOk({})]);
		await tunnels.delete(ACCOUNT, TUNNEL_ID);
		expect(calls[0]?.method).toBe("DELETE");
		expect(calls[0]?.url).toContain(`/accounts/${ACCOUNT}/cfd_tunnel/${TUNNEL_ID}`);
		expect(calls[0]?.url).toContain("cascade=true");
	});
});
