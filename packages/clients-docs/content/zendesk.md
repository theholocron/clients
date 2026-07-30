---
title: Zendesk Client
description: TypeScript client for the Zendesk REST API, built on @theholocron/http-client.
---

`@theholocron/zendesk-client` is a typed wrapper around the Zendesk Support API for managing tickets, statuses, fields, and search.

## Install

```bash
npm i @theholocron/zendesk-client
```

## Usage

```ts
import { createZendeskClient, createToken } from "@theholocron/zendesk-client";

const client = createZendeskClient({
  baseUrl: "https://myorg.zendesk.com",
  token: createToken(process.env.ZENDESK_EMAIL, process.env.ZENDESK_API_TOKEN),
});

const tickets = await client.tickets.list();
const ticket = await client.tickets.get(12345);
await client.tickets.create({ subject: "Help needed", body: "Details here" });

const results = await client.search.query("type:ticket status:open");
```

## Namespaces

| Namespace    | Methods                                     |
| ------------ | ------------------------------------------- |
| `activities` | `get`                                       |
| `comments`   | (see package)                               |
| `fields`     | (see package)                               |
| `search`     | `query`                                     |
| `status`     | `list`, `get`, `create`, `update`           |
| `tickets`    | `list`, `get`, `create`, `update`, `delete` |
