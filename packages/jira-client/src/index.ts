import { createRestClient } from "@theholocron/http-client";

import { issues } from "./issues.js";
import { links } from "./links.js";
import { projects } from "./projects.js";
import { transitions } from "./transitions.js";
import { versions } from "./versions.js";

export type * from "./types.js";
export type { IssueLinkResult } from "./links.js";

export type { issues, links, projects, transitions, versions };

export function createJiraClient(options: {
	host: string;
	token: string;
	fetch?: typeof fetch;
}) {
	const client = createRestClient({
		baseUrl: options.host,
		token: options.token,
		tokenScheme: "basic",
		vendor: "Jira",
		fetch: options.fetch,
	});
	return {
		issues: issues(client),
		links: links(client),
		projects: projects(client),
		transitions: transitions(client),
		versions: versions(client),
	};
}
