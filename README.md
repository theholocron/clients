# `@theholocron/clients`

<!-- holocron:description -->

API clients and shared HTTP primitives.

<!-- /holocron:description -->

<!-- holocron:installation -->

## Installation

```bash
pnpm install @theholocron/clients
```

## Usage

```typescript
import {} from "@theholocron/clients";
```

<!-- /holocron:installation -->

## Packages

| Package                                                          | Description                                                                           |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [`@theholocron/http-client`](./packages/http-client)             | Shared HTTP primitives — `createRestClient`, `createResolveToken`, `ProviderApiError` |
| [`@theholocron/clerk-client`](./packages/clerk-client)           | TypeScript client for the Clerk Backend API                                           |
| [`@theholocron/cloudflare-client`](./packages/cloudflare-client) | TypeScript client for the Cloudflare API                                              |
| [`@theholocron/confluence-client`](./packages/confluence-client) | TypeScript client for the Confluence API                                              |
| [`@theholocron/doppler-client`](./packages/doppler-client)       | TypeScript client for the Doppler API                                                 |
| [`@theholocron/github-client`](./packages/github-client)         | TypeScript client for the GitHub REST API                                             |
| [`@theholocron/google-client`](./packages/google-client)         | TypeScript client for Google Workspace (Docs, Sheets)                                 |
| [`@theholocron/infisical-client`](./packages/infisical-client)   | TypeScript client for the Infisical API                                               |
| [`@theholocron/jira-client`](./packages/jira-client)             | TypeScript client for the Jira REST API                                               |
| [`@theholocron/neon-client`](./packages/neon-client)             | TypeScript client for the Neon API                                                    |
| [`@theholocron/posthog-client`](./packages/posthog-client)       | TypeScript client for the PostHog API                                                 |
| [`@theholocron/postman-client`](./packages/postman-client)       | TypeScript client for the Postman API                                                 |
| [`@theholocron/sentry-client`](./packages/sentry-client)         | TypeScript client for the Sentry API                                                  |
| [`@theholocron/vercel-client`](./packages/vercel-client)         | TypeScript client for the Vercel API                                                  |
| [`@theholocron/zendesk-client`](./packages/zendesk-client)       | TypeScript client for the Zendesk API                                                 |

## Development

This repo uses [pnpm workspaces](https://pnpm.io/workspaces) and [Turbo](https://turbo.build).

```bash
pnpm install       # install all deps
pnpm build         # build all packages
pnpm test          # test all packages
pnpm typecheck     # typecheck all packages
pnpm lint          # lint all packages
```

## Releases

Releases are automated via [semantic-release](https://semantic-release.gitbook.io) on push to `main`. All packages are versioned and published in lockstep. See [CHANGELOG.md](CHANGELOG.md) for the release history.
