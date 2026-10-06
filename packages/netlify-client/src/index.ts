import { deploys } from "./deploys/deploys.js";
import { env } from "./env/env.js";
import { sites } from "./sites/sites.js";
import { createNetlifyRestClient, type NetlifyClientOptions } from "./utils.js";

export type { NetlifyDeploy, NetlifyRawTransport } from "./deploys/deploys.js";
export type { NetlifyEnvContext, NetlifyEnvVar, NetlifyEnvVarValue } from "./env/env.js";
export type { NetlifyCreateSiteInput, NetlifySite, NetlifyUpdateSiteInput } from "./sites/sites.js";
export type { NetlifyClientOptions } from "./utils.js";
export { buildZip } from "./zip.js";

export function createNetlifyClient(opts: NetlifyClientOptions) {
	const rest = createNetlifyRestClient(opts);
	return {
		sites: sites(rest),
		deploys: deploys(rest, { token: opts.token, baseUrl: opts.baseUrl, fetch: opts.fetch }),
		env: env(rest),
	};
}

export type NetlifyClient = ReturnType<typeof createNetlifyClient>;
