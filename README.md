# @theholocron/clients

API clients and shared HTTP primitives used across the Galaxy.

## Packages

| Package                                                          | Description                                                                           |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [`@theholocron/http-client`](./packages/http-client)             | Shared HTTP primitives — `createRestClient`, `createResolveToken`, `ProviderApiError` |
| [`@theholocron/github-client`](./packages/github-client)         | TypeScript client for the GitHub REST API                                             |
| [`@theholocron/jira-client`](./packages/jira-client)             | TypeScript client for the Jira REST API                                               |
| [`@theholocron/google-client`](./packages/google-client)         | TypeScript client for Google Workspace (Docs, Sheets)                                 |
| [`@theholocron/zendesk-client`](./packages/zendesk-client)       | TypeScript client for the Zendesk API                                                 |
| [`@theholocron/confluence-client`](./packages/confluence-client) | TypeScript client for the Confluence API                                              |

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
