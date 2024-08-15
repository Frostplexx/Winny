import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    TextInputStyle,
    SlashCommandBuilder,
    TextInputBuilder, ModalSubmitInteraction,
} from 'discord.js'
import SlashCommand from "../commandTypes/slashCommand";
import { ModalWrapper } from "../../modalHandler/modal";
import { GithubAPI, IssueObject } from "../../../features/webHandler/githubAPI";
import { label } from "../../../features/autoLabeler/bayes";
import { autoLabeler } from "../../../globals/constants";
import { LinearIssueObject, linearAPI } from '../../../features/linearHandler/linear';


export enum ServiceType {
    NOTCHNOOK = "notchnook",
    WINSTON = "winston"
}

export default new SlashCommand({
    //______SLASH COMMAND OPTIONS_________
    data: new SlashCommandBuilder()
        .setName('issues')
        .addSubcommand((subcommand) =>
            subcommand
                .setName("create-feature-request")
                .setDescription("List all cached items")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("create-bug")
                .setDescription("Clear the cache")
        )
        .setDescription("Manage cached themes"),
    //_________COMMAND____________
    async execute(interaction): Promise<void> {
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case "create-feature-request":
                await createFRCommand(interaction, ServiceType.WINSTON)
                break
            case "create-bug":
                await createBugCommand(interaction, ServiceType.WINSTON)
                break
            default:
                await interaction.reply("No Subcommand found")
                break
        }
    },
})


//_________FEATURE REQUEST____________
export async function createFRCommand(interaction: ChatInputCommandInteraction, type: ServiceType) {
    const row1 = new ActionRowBuilder()
        .addComponents(
            [
                new TextInputBuilder()
                    .setCustomId("frtitle")
                    .setLabel("Title of your Feature Request")
                    .setPlaceholder("Very informative Title")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short),

            ]
        )
    const row2 = new ActionRowBuilder()
        .addComponents([
            new TextInputBuilder()
                .setCustomId("featuredesc")
                .setPlaceholder("A clear and concise description of what the problem is.")
                .setLabel("Is your feature request related to a problem?")
                .setRequired(false)
                .setStyle(TextInputStyle.Paragraph),

        ])
    const row3 = new ActionRowBuilder()
        .addComponents([
            new TextInputBuilder()
                .setCustomId("solution")
                .setLabel("Describe the solution you'd like")
                .setRequired(true)
                .setPlaceholder("A clear and concise description of what you want to happen.")
                .setStyle(TextInputStyle.Paragraph),

        ])
    const row4 = new ActionRowBuilder()
        .addComponents([
            new TextInputBuilder()
                .setCustomId("alternative")
                .setLabel("Describe alternatives you've considered")
                .setRequired(false)
                .setPlaceholder("A clear and concise description of any alternative solutions or features you've considered.")
                .setStyle(TextInputStyle.Paragraph),

        ])
    const row5 = new ActionRowBuilder()
        .addComponents([
            new TextInputBuilder()
                .setCustomId("context")
                .setLabel("Additional context")
                .setRequired(false)
                .setPlaceholder("Add any other context about the feature request here.")
                .setStyle(TextInputStyle.Paragraph)
        ])


    var modal: ModalWrapper | null = null

    switch (type) {
        case ServiceType.WINSTON:
            modal = new ModalWrapper(uploadFeatureToGithub)
                .setTitle("Create new Feature Request")
                .setComponents([row1, row2, row3, row4, row5] as any)
            break;
        case ServiceType.NOTCHNOOK:
            modal = new ModalWrapper(uploadFeatureToNotchNook)
                .setTitle("Create new Feature Request")
                .setComponents([row1, row2, row3, row4, row5] as any)
            break;
        default:
            break;
    }

    if (modal) { await interaction.showModal(modal) }
}

//_________BUG REPORT____________
export async function createBugCommand(interaction: ChatInputCommandInteraction, type: ServiceType) {
    const row1 = new ActionRowBuilder()
        .addComponents(
            [
                new TextInputBuilder()
                    .setCustomId("name")
                    .setLabel("Title of your Bug Request")
                    .setPlaceholder("Very informative Title")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short),

            ]
        )
    const row2 = new ActionRowBuilder()
        .addComponents([
            new TextInputBuilder()
                .setCustomId("bugdesc")
                .setPlaceholder("A clear and concise description of what the bug is.")
                .setLabel("Describe the bug")
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph),

        ])
    const row3 = new ActionRowBuilder()
        .addComponents([
            new TextInputBuilder()
                .setCustomId("steps")
                .setLabel("Steps to reproduce the behavior")
                .setRequired(true)
                .setPlaceholder("1. Go to '...'\n2. Click on '....'\n3. Scroll down to '....'\n4. See error")
                .setStyle(TextInputStyle.Paragraph),

        ])
    const row4 = new ActionRowBuilder()
        .addComponents([
            new TextInputBuilder()
                .setCustomId("expected")
                .setLabel("Expected behavior")
                .setRequired(true)
                .setPlaceholder("A clear and concise description of what you expected to happen.")
                .setStyle(TextInputStyle.Paragraph),

        ])
    const row5 = new ActionRowBuilder()
        .addComponents([
            new TextInputBuilder()
                .setCustomId("osinfo")
                .setLabel("Device and OS Info: iOS 17, iPhone 15")
                .setRequired(true)
                .setPlaceholder(" - Device: [e.g. iPhone 15]\n- OS: [e.g. iOS 17.0]")
                .setStyle(TextInputStyle.Paragraph)
        ])
    var modal: ModalWrapper | null = null

    switch (type) {
        case ServiceType.WINSTON:
            modal = new ModalWrapper(uploadBugToGithub)
                .setTitle("Create new Bug Request")
                .setComponents([row1, row2, row3, row4, row5] as any)
            break;
        case ServiceType.NOTCHNOOK:
            modal = new ModalWrapper(uploadBugToNotchNook)
                .setTitle("Create new Bug Request")
                .setComponents([row1, row2, row3, row4, row5] as any)
            break;
        default:
            break;
    }

    if (modal) { await interaction.showModal(modal) }
}



//_________FUNCTIONS____________
async function uploadFeatureToGithub(interaction: ModalSubmitInteraction) {
    const title = interaction.fields.getTextInputValue("frtitle")
    const featuredesc = interaction.fields.getTextInputValue("featuredesc")
    const solution = interaction.fields.getTextInputValue("solution")
    const alternative = interaction.fields.getTextInputValue("alternative")
    const context = interaction.fields.getTextInputValue("context")
    let issuesDetails: IssueObject = {
        owner: "lo-cafe",
        repo: "winston",
        title: "[FR] " + title,
        labels: ["feature/enhancement"],
        body: "**Is your feature request related to a problem? Please describe.**\n" +
            featuredesc +
            "\n\n" +
            "**Describe the solution you'd like**\n" +
            solution +
            "\n\n" +
            "**Describe alternatives you've considered**\n" +
            alternative +
            "\n\n" +
            "**Additional context**\n" +
            context +
            "\n\n---\n\n" +
            "Posted by " + interaction.user.username
    }
    const success = await GithubAPI.createIssue(issuesDetails)
    if (success) {
        await interaction.reply({ content: "Issue Successfully submitted", ephemeral: true })
    } else {
        await interaction.reply({ content: "Error :(", ephemeral: true })
    }
}

async function uploadBugToGithub(interaction: ModalSubmitInteraction) {
    const title = interaction.fields.getTextInputValue("name")
    const bugdesc = interaction.fields.getTextInputValue("bugdesc")
    const steps = interaction.fields.getTextInputValue("steps")
    const expected = interaction.fields.getTextInputValue("expected")
    const osinfo = interaction.fields.getTextInputValue("osinfo")
    let issuesDetails: IssueObject = {
        owner: "lo-cafe",
        repo: "winston",
        title: "[Bug] " + title,
        labels: ["bug/fix"],
        body: "**Describe the bug**\n" +
            bugdesc +
            "\n\n" +
            "**To Reproduce**\n" +
            "Steps to reproduce the behavior:\n" +
            steps +
            "\n\n" +
            "**Expected behavior**\n" +
            expected +
            "\n\n" +
            "**Device (please complete the following information):**\n" +
            osinfo +
            "\n\n---\n\n" +
            "Posted by " + interaction.user.username
    }
    const labels = label(issuesDetails.title + " " + issuesDetails.body);
    if (autoLabeler) {
        issuesDetails.labels = labels
    }
    const success = await GithubAPI.createIssue(issuesDetails)
    if (success) {
        await interaction.reply({ content: "Issue Successfully submitted", ephemeral: true })
    } else {
        await interaction.reply({ content: "Error :(", ephemeral: true })
    }
}


async function uploadBugToNotchNook(interaction: ModalSubmitInteraction) {
    const title = interaction.fields.getTextInputValue("name")
    const bugdesc = interaction.fields.getTextInputValue("bugdesc")
    const steps = interaction.fields.getTextInputValue("steps")
    const expected = interaction.fields.getTextInputValue("expected")
    const osinfo = interaction.fields.getTextInputValue("osinfo")
    let issueDetails: LinearIssueObject = {
        title: title,
        body: "**Describe the bug**\n" +
            bugdesc +
            "\n\n" +
            "**To Reproduce**\n" +
            "Steps to reproduce the behavior:\n" +
            steps +
            "\n\n" +
            "**Expected behavior**\n" +
            expected +
            "\n\n" +
            "**Device (please complete the following information):**\n" +
            osinfo +
            "\n\n---\n\n" +
            "Posted by " + interaction.user.username,
        priority: 0,
        labels: ["ce7acd0f-c5f9-4761-b1eb-f19e2862a53b"],
        team: "962e3a71-525a-4d3c-9b61-b7b00f181eb4"
    }
    const success = await linearAPI.createIssue(issueDetails)
    if (success) {
        await interaction.reply({ content: "Issue Successfully submitted", ephemeral: true })
    } else {
        await interaction.reply({ content: "Error :(", ephemeral: true })
    }
}



async function uploadFeatureToNotchNook(interaction: ModalSubmitInteraction) {
    const title = interaction.fields.getTextInputValue("frtitle")
    const featuredesc = interaction.fields.getTextInputValue("featuredesc")
    const solution = interaction.fields.getTextInputValue("solution")
    const alternative = interaction.fields.getTextInputValue("alternative")
    const context = interaction.fields.getTextInputValue("context")
    let issuesDetails: LinearIssueObject = {
        title: "[FR] " + title,
        priority: 0,
        team: "962e3a71-525a-4d3c-9b61-b7b00f181eb4",
        labels: ["3997e5b1-95fd-4118-9916-ccd2f263145a"],
        body: "**Is your feature request related to a problem? Please describe.**\n" +
            featuredesc +
            "\n\n" +
            "**Describe the solution you'd like**\n" +
            solution +
            "\n\n" +
            "**Describe alternatives you've considered**\n" +
            alternative +
            "\n\n" +
            "**Additional context**\n" +
            context +
            "\n\n---\n\n" +
            "Posted by " + interaction.user.username
    }
    const success = await linearAPI.createIssue(issuesDetails)
    if (success) {
        await interaction.reply({ content: "Issue Successfully submitted", ephemeral: true })
    } else {
        await interaction.reply({ content: "Error :(", ephemeral: true })
    }
}
