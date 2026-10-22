import { describe, expect, it } from "vitest";

import { ChannelType, createDiscordBotClient } from "../index.js";
import { stubFetch } from "./helpers.js";

const BASE = "https://discord.test/api/v10";

function makeClient(responses: Parameters<typeof stubFetch>[0]) {
	const { fetch, calls } = stubFetch(responses);
	return {
		client: createDiscordBotClient({
			botToken: "tok",
			baseUrl: BASE,
			fetch,
		}),
		calls,
	};
}

describe("createDiscordBotClient", () => {
	it("authenticates with the Bot scheme, not Bearer", async () => {
		const { client, calls } = makeClient([
			{ body: { id: "u1", username: "holonet", bot: true } },
		]);
		await client.users.me();
		expect(calls[0]?.headers.authorization).toBe("Bot tok");
	});

	it("targets the default Discord base URL when no override is given", async () => {
		const { fetch, calls } = stubFetch([
			{ body: { id: "u1", username: "holonet" } },
		]);
		await createDiscordBotClient({ botToken: "tok", fetch }).users.me();
		expect(calls[0]?.url).toBe("https://discord.com/api/v10/users/@me");
	});
});

describe("guilds", () => {
	it("get: GET /guilds/:id", async () => {
		const { client, calls } = makeClient([
			{ body: { id: "g1", name: "Holocron" } },
		]);
		expect(await client.guilds.get("g1")).toEqual({
			id: "g1",
			name: "Holocron",
		});
		expect(calls[0]).toMatchObject({
			url: `${BASE}/guilds/g1`,
			method: "GET",
		});
	});

	it("channels: GET /guilds/:id/channels", async () => {
		const { client, calls } = makeClient([
			{ body: [{ id: "c1", name: "alerts", type: 0 }] },
		]);
		expect(await client.guilds.channels("g1")).toHaveLength(1);
		expect(calls[0]).toMatchObject({
			url: `${BASE}/guilds/g1/channels`,
			method: "GET",
		});
	});

	it("createChannel: POST /guilds/:id/channels with the body", async () => {
		const { client, calls } = makeClient([
			{ body: { id: "c2", name: "sync", type: 0 } },
		]);
		await client.guilds.createChannel("g1", {
			name: "sync",
			type: ChannelType.Text,
			parent_id: "cat1",
		});
		expect(calls[0]).toMatchObject({
			url: `${BASE}/guilds/g1/channels`,
			method: "POST",
			body: { name: "sync", type: 0, parent_id: "cat1" },
		});
	});

	it("roles: GET /guilds/:id/roles", async () => {
		const { client, calls } = makeClient([
			{
				body: [
					{
						id: "r1",
						name: "gatekeepers",
						color: 0,
						mentionable: true,
					},
				],
			},
		]);
		expect(await client.guilds.roles("g1")).toHaveLength(1);
		expect(calls[0]).toMatchObject({
			url: `${BASE}/guilds/g1/roles`,
			method: "GET",
		});
	});

	it("createRole: POST /guilds/:id/roles with the body", async () => {
		const { client, calls } = makeClient([
			{
				body: {
					id: "r2",
					name: "gatekeepers",
					color: 0,
					mentionable: true,
				},
			},
		]);
		await client.guilds.createRole("g1", {
			name: "gatekeepers",
			mentionable: true,
		});
		expect(calls[0]).toMatchObject({
			url: `${BASE}/guilds/g1/roles`,
			method: "POST",
			body: { name: "gatekeepers", mentionable: true },
		});
	});
});

describe("channels", () => {
	it("modify: PATCH /channels/:id", async () => {
		const { client, calls } = makeClient([
			{ body: { id: "c1", name: "alerts", type: 0 } },
		]);
		await client.channels.modify("c1", { parent_id: "cat1" });
		expect(calls[0]).toMatchObject({
			url: `${BASE}/channels/c1`,
			method: "PATCH",
			body: { parent_id: "cat1" },
		});
	});

	it("webhooks: GET /channels/:id/webhooks", async () => {
		const { client, calls } = makeClient([
			{ body: [{ id: "w1", name: "repo-sync", channel_id: "c1" }] },
		]);
		expect(await client.channels.webhooks("c1")).toHaveLength(1);
		expect(calls[0]).toMatchObject({
			url: `${BASE}/channels/c1/webhooks`,
			method: "GET",
		});
	});

	it("createWebhook: POST /channels/:id/webhooks and returns the token + url", async () => {
		const { client, calls } = makeClient([
			{
				body: {
					id: "w2",
					name: "repo-sync",
					channel_id: "c1",
					token: "t",
					url: "https://discord.com/api/webhooks/w2/t",
				},
			},
		]);
		const hook = await client.channels.createWebhook("c1", {
			name: "repo-sync",
		});
		expect(hook.url).toBe("https://discord.com/api/webhooks/w2/t");
		expect(calls[0]).toMatchObject({
			url: `${BASE}/channels/c1/webhooks`,
			method: "POST",
			body: { name: "repo-sync" },
		});
	});

	it("surfaces a non-2xx response as a ProviderApiError carrying the status", async () => {
		const { client } = makeClient([
			{ status: 403, text: '{"message":"Missing Permissions"}' },
		]);
		await expect(client.guilds.channels("g1")).rejects.toMatchObject({
			status: 403,
		});
	});
});
