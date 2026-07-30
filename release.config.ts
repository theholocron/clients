import { defineConfig } from "@theholocron/semantic-release-config";

const packages = [
	"packages/clerk-client",
	"packages/clients-docs",
	"packages/confluence-client",
	"packages/doppler-client",
	"packages/github-client",
	"packages/google-client",
	"packages/http-client",
	"packages/infisical-client",
	"packages/jira-client",
	"packages/neon-client",
	"packages/postman-client",
	"packages/vercel-client",
	"packages/zendesk-client",
];

const packageList = packages.map((p) => `'${p}'`).join(",");

export default defineConfig({
	exec: {
		prepareCmd: `node -e "const fs=require('fs'),v='\${nextRelease.version}'; [${packageList}].forEach(p=>{const f=p+'/package.json',j=JSON.parse(fs.readFileSync(f));j.version=v;fs.writeFileSync(f,JSON.stringify(j,null,2)+'\\n');});"`,
		publishCmd:
			"pnpm -r --filter='./packages/*' publish --access public --no-git-checks --tag ${nextRelease.channel || 'latest'}",
	},
});
