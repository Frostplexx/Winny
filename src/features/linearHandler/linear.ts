import { LinearClient } from '@linear/sdk'
import { IssueCreateInput } from '@linear/sdk/dist/_generated_documents';
import dotenv from 'dotenv'

dotenv.config({ path: "./.env" });
// Api key authentication
const linearClient = new LinearClient({
    apiKey: process.env.LINEAR_API_KEY
})


export const linearAPI = {
    createIssue: async function(issueObject: LinearIssueObject): Promise<boolean> {
        const issue: IssueCreateInput = {
            title: issueObject.title,
            description: issueObject.body,
            labelIds: issueObject.labels,
            priority: issueObject.priority,
            teamId: issueObject.team
        }
        const res = await linearClient.createIssue(issue)
        return res.success

    }
}

export interface LinearIssueObject {
    title: string,
    body: string,
    priority: number,
    labels: string[],
    team: string
}
