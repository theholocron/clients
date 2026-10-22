import { createRestClient, type RestClient } from "@theholocron/http-client";

import { DEFAULT_BASE_URL } from "../utils.js";
import type {
	CreateChannelInput,
	CreateRoleInput,
	DiscordBotClientOptions,
	DiscordChannel,
	DiscordChannelWebhook,
	DiscordGuild,
	DiscordRole,
	DiscordUser,
	ModifyChannelInput,
} from "./bot.type.js";

/**
 * Bot-authenticated Discord REST resources (`Authorization: Bot <token>`),
 * for provisioning a server: channels, roles, and per-channel webhooks.
 * Webhook posting stays on {@link createDiscordClient}, which needs no token.
 *
 * `http-client` only knows `Bearer`/`Basic`/api-key, so the `Bot` scheme is
 * sent as an api-key header carrying the whole `Bot <token>` value.
 */
export function createDiscordBotClient(opts: DiscordBotClientOptions) {
	const rest: RestClient = createRestClient({
		baseUrl: opts.baseUrl ?? DEFAULT_BASE_URL,
		token: `Bot ${opts.botToken}`,
		tokenScheme: "apikey",
		apiKeyHeader: "authorization",
		vendor: "Discord",
		fetch: opts.fetch,
	});

	return {
		users: {
			/** `GET /users/@me` — the bot's own user; a cheap token check. */
			me: () => rest.request<DiscordUser>("/users/@me"),
		},
		guilds: {
			get: (guildId: string) =>
				rest.request<DiscordGuild>(`/guilds/${guildId}`),
			channels: (guildId: string) =>
				rest.request<DiscordChannel[]>(`/guilds/${guildId}/channels`),
			createChannel: (guildId: string, body: CreateChannelInput) =>
				rest.request<DiscordChannel>(`/guilds/${guildId}/channels`, {
					method: "POST",
					body,
				}),
			roles: (guildId: string) =>
				rest.request<DiscordRole[]>(`/guilds/${guildId}/roles`),
			createRole: (guildId: string, body: CreateRoleInput) =>
				rest.request<DiscordRole>(`/guilds/${guildId}/roles`, {
					method: "POST",
					body,
				}),
		},
		channels: {
			modify: (channelId: string, body: ModifyChannelInput) =>
				rest.request<DiscordChannel>(`/channels/${channelId}`, {
					method: "PATCH",
					body,
				}),
			webhooks: (channelId: string) =>
				rest.request<DiscordChannelWebhook[]>(
					`/channels/${channelId}/webhooks`,
				),
			createWebhook: (channelId: string, body: { name: string }) =>
				rest.request<DiscordChannelWebhook>(
					`/channels/${channelId}/webhooks`,
					{ method: "POST", body },
				),
		},
	};
}

export type DiscordBotClient = ReturnType<typeof createDiscordBotClient>;
