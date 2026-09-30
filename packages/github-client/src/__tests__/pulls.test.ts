import { describe, expect, it } from "vitest";

import { createGitHubClient } from "../index.js";
import { REPO, stubFetch, TOKEN } from "./helpers.js";

const RAW_PR = {
	number: 42,
	title: "fix: something",
	state: "closed" as const,
	merged_at: "2026-08-28T00:00:00Z",
	html_url: "https://github.com/theholocron/test-repo/pull/42",
	head: { ref: "fix/something" },
};

describe("pulls.getPullRequest", () => {
	it("GETs /repos/{owner}/{name}/pulls/{number}", async () => {
		const { fetch, calls } = stubFetch([{ body: RAW_PR }]);
		const client = createGitHubClient({ token: TOKEN, fetch });
		const result = await client.pulls.getPullRequest(REPO, 42);
		expect(calls[0]?.method).toBe("GET");
		expect(calls[0]?.url).toContain("/repos/theholocron/test-repo/pulls/42");
		expect(result.number).toBe(42);
		expect(result.title).toBe("fix: something");
		expect(result.state).toBe("closed");
		expect(result.merged_at).toBe("2026-08-28T00:00:00Z");
		expect(result.head.ref).toBe("fix/something");
	});
});

describe("pulls.listCommits", () => {
	it("GETs /repos/{owner}/{name}/pulls/{number}/commits with per_page=100", async () => {
		const commits = [
			{ sha: "abc1234", commit: { message: "feat: 💥 add thing" } },
			{ sha: "def5678", commit: { message: "fix: 🐛 fix thing" } },
		];
		const { fetch, calls } = stubFetch([{ body: commits }]);
		const client = createGitHubClient({ token: TOKEN, fetch });
		const result = await client.pulls.listCommits(REPO, 42);
		expect(calls[0]?.method).toBe("GET");
		expect(calls[0]?.url).toContain("/repos/theholocron/test-repo/pulls/42/commits");
		expect(calls[0]?.url).toContain("per_page=100");
		expect(result).toHaveLength(2);
		expect(result[0]?.sha).toBe("abc1234");
		expect(result[0]?.commit.message).toBe("feat: 💥 add thing");
	});
});

describe("pulls.listFiles", () => {
	it("GETs /repos/{owner}/{name}/pulls/{number}/files with per_page=100", async () => {
		const files = [
			{ filename: "README.md", status: "modified" as const },
			{ filename: "old-name.ts", status: "renamed" as const, previous_filename: "name.ts" },
		];
		const { fetch, calls } = stubFetch([{ body: files }]);
		const client = createGitHubClient({ token: TOKEN, fetch });
		const result = await client.pulls.listFiles(REPO, 42);
		expect(calls[0]?.method).toBe("GET");
		expect(calls[0]?.url).toContain("/repos/theholocron/test-repo/pulls/42/files");
		expect(calls[0]?.url).toContain("per_page=100");
		expect(result).toHaveLength(2);
		expect(result[0]?.filename).toBe("README.md");
		expect(result[0]?.status).toBe("modified");
		expect(result[1]?.previous_filename).toBe("name.ts");
	});
});

describe("pulls.createReview", () => {
	it("POSTs /repos/{owner}/{name}/pulls/{number}/reviews with the given body", async () => {
		const { fetch, calls } = stubFetch([
			{ body: { id: 99, html_url: "https://github.com/theholocron/test-repo/pull/42#pullrequestreview-99" } },
		]);
		const client = createGitHubClient({ token: TOKEN, fetch });

		const result = await client.pulls.createReview(REPO, 42, {
			commit_id: "abc123",
			body: "2 error(s) found — see inline comments below.",
			event: "COMMENT",
			comments: [{ path: "src/index.ts", line: 12, side: "RIGHT", body: "'x' is defined but never used." }],
		});

		expect(calls[0]?.method).toBe("POST");
		expect(calls[0]?.url).toContain("/repos/theholocron/test-repo/pulls/42/reviews");
		expect(calls[0]?.body).toEqual({
			commit_id: "abc123",
			body: "2 error(s) found — see inline comments below.",
			event: "COMMENT",
			comments: [{ path: "src/index.ts", line: 12, side: "RIGHT", body: "'x' is defined but never used." }],
		});
		expect(result.id).toBe(99);
		expect(result.html_url).toBe("https://github.com/theholocron/test-repo/pull/42#pullrequestreview-99");
	});

	it("submits a review with no inline comments -- a body-only review", async () => {
		const { fetch, calls } = stubFetch([
			{ body: { id: 100, html_url: "https://github.com/x/y/pull/1#pullrequestreview-100" } },
		]);
		const client = createGitHubClient({ token: TOKEN, fetch });

		await client.pulls.createReview(REPO, 42, {
			commit_id: "abc123",
			body: "All clear.",
			event: "COMMENT",
		});

		const body = calls[0]?.body as { comments?: unknown };
		expect(body.comments).toBeUndefined();
	});
});
