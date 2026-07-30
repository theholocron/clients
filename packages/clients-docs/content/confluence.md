---
title: Confluence Client
description: TypeScript client for the Confluence Cloud REST API, built on @theholocron/http-client.
---

`@theholocron/confluence-client` is a typed wrapper around the Confluence Cloud REST API for reading and updating pages.

## Install

```bash
npm i @theholocron/confluence-client
```

## Usage

```ts
import { createConfluenceClient } from "@theholocron/confluence-client";

const token = Buffer.from(
  `${process.env.ATLASSIAN_EMAIL}:${process.env.ATLASSIAN_TOKEN}`,
).toString("base64");

const client = createConfluenceClient({
  baseUrl: "https://myorg.atlassian.net/wiki/rest/api",
  token,
});

const page = await client.page.get("123456789");
await client.page.update("123456789", {
  title: "Updated title",
  body: "<p>New content</p>",
});
```

## Namespaces

| Namespace | Methods         |
| --------- | --------------- |
| `page`    | `get`, `update` |
