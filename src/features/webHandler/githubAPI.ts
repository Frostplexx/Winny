import {Octokit} from "@octokit/rest";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN
})

export const GithubAPI = {

	/**
	 * Creates a new issue in a GitHub repository.
	 *
	 * @param {IssueObject} issueObject - The object containing the parameters for creating the issue.
	 * @returns {Promise<void>} - A promise that resolves when the issue is successfully created.
	 *
	 * @throws {Error} - If there is an error creating the issue.
	 */
	createIssue: async function (issueObject: IssueObject): Promise<boolean>{
		const res = await octokit.request('POST /repos/{owner}/{repo}/issues', {
			owner: issueObject.owner,
			repo: issueObject.repo,
			title: issueObject.title,
			body: issueObject.body,
			labels: issueObject.labels,
			headers: {
				'X-GitHub-Api-Version': '2022-11-28'
			}
		})

		switch (res.status) {
			case 201:
				return true
			default:
				return false
		}
	},
	getIssues: async function (owner: string, repo: string): Promise<any> {
		const response = await octokit.rest.issues.listForRepo({
			owner,
			repo,
		});

		if (response.status !== 200) {
			throw new Error(`Failed to get issues. HTTP status: ${response.status}`);
		}

		return response.data; // contains array of all issue objects for the repo
	}
}

/**
 * Represents an issue object.
 *
 * @interface IssueObject
 */
export interface IssueObject{
	title: string,
	owner: string
	repo: string,
	body: string
	labels: string[]
}