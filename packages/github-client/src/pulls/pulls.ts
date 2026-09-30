import type { RestClient } from "../utils.js";
import { repoBase } from "../utils.js";

export interface GitHubPullRequest {
	number: number;
	title: string;
	state: "open" | "closed";
	merged_at: string | null;
	html_url: string;
	head: { ref: string };
}

/** One commit as returned by `GET /pulls/{pull_number}/commits` — only the fields any known consumer needs. */
export interface GitHubPullRequestCommit {
	sha: string;
	commit: { message: string };
}

/** One file as returned by `GET /pulls/{pull_number}/files` — only the fields any known consumer needs. */
export interface GitHubPullRequestFile {
	filename: string;
	status: "added" | "removed" | "modified" | "renamed" | "copied" | "changed" | "unchanged";
	/** Set only when `status === "renamed"`. */
	previous_filename?: string;
}

/** One inline comment in a `POST /pulls/{pull_number}/reviews` request body. */
export interface CreateReviewComment {
	/** File path relative to the repo root. */
	path: string;
	/** 1-indexed line in the file's current (`RIGHT`) version — GitHub anchors a review comment to a line, not a column. */
	line: number;
	/** Almost always `"RIGHT"` (the PR's own new content) — `"LEFT"` targets the base/pre-PR version instead. */
	side: "LEFT" | "RIGHT";
	body: string;
}

export interface CreateReviewInput {
	/** The PR's head SHA the review attaches to. */
	commit_id: string;
	/** The review's own top-level summary, shown above its inline comments. */
	body: string;
	/**
	 * `"COMMENT"` never blocks a merge by itself — the right choice for an
	 * advisory bot review. `"REQUEST_CHANGES"`/`"APPROVE"` carry the same
	 * real weight as a human reviewer's own review state, affecting
	 * required-approval counts and dismissal.
	 */
	event: "COMMENT" | "REQUEST_CHANGES" | "APPROVE";
	comments?: CreateReviewComment[];
}

/** `POST /pulls/{pull_number}/reviews`'s response — only the fields any known consumer needs. */
export interface GitHubPullRequestReview {
	id: number;
	html_url: string;
}

export function pulls(rest: RestClient) {
	return {
		getPullRequest: (repo: string, number: number): Promise<GitHubPullRequest> =>
			rest.request<GitHubPullRequest>(`${repoBase(repo)}/pulls/${number}`),

		/**
		 * A PR's own commits, in commit order. `per_page=100` — GitHub's max —
		 * covers every real PR in this org; a PR genuinely exceeding 100
		 * commits (GitHub caps this endpoint at 250 regardless of pagination)
		 * is an edge case no consumer here needs to paginate for today.
		 */
		listCommits: (repo: string, number: number): Promise<GitHubPullRequestCommit[]> =>
			rest.request<GitHubPullRequestCommit[]>(`${repoBase(repo)}/pulls/${number}/commits?per_page=100`),

		/**
		 * A PR's own changed files. `per_page=100` — GitHub's max — covers
		 * every real PR in this org; a PR genuinely exceeding 100 changed
		 * files (GitHub caps this endpoint at 3000 regardless of pagination)
		 * is an edge case no consumer here needs to paginate for today.
		 */
		listFiles: (repo: string, number: number): Promise<GitHubPullRequestFile[]> =>
			rest.request<GitHubPullRequestFile[]>(`${repoBase(repo)}/pulls/${number}/files?per_page=100`),

		/**
		 * Submits a review in one call — GitHub has no separate "create draft,
		 * then submit" step when `event` is provided directly (the multi-step
		 * `PENDING` review flow exists for the web UI's own draft-comments
		 * experience, not needed here).
		 */
		createReview: (repo: string, number: number, input: CreateReviewInput): Promise<GitHubPullRequestReview> =>
			rest.request<GitHubPullRequestReview>(`${repoBase(repo)}/pulls/${number}/reviews`, {
				method: "POST",
				body: input,
			}),
	};
}
