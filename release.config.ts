import { defineConfig } from "@theholocron/semantic-release-config";

export default defineConfig({
	exec: {
		prepareCmd:
			"node -e \"const fs=require('fs'),v='${nextRelease.version}'; ['packages/clerk-client','packages/confluence-client','packages/doppler-client','packages/github-client','packages/google-client','packages/http-client','packages/infisical-client','packages/jira-client','packages/neon-client','packages/zendesk-client'].forEach(p=>{const f=p+'/package.json',j=JSON.parse(fs.readFileSync(f));j.version=v;fs.writeFileSync(f,JSON.stringify(j,null,2)+'\\n');});\"",
		publishCmd:
			"pnpm -r --filter='./packages/*' publish --access public --no-git-checks --tag ${nextRelease.channel || 'latest'}",
	},
});
