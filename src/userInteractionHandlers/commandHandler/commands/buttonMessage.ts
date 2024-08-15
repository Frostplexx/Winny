import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import SlashCommand from "../commandTypes/slashCommand";
import { Button, ExBtnEvent } from "../../buttonHandler/button";
import { registerButton } from "../../buttonHandler/registerButtons";

export default new SlashCommand({
    //______SLASH COMMAND OPTIONS_________
    data: new SlashCommandBuilder()
        .setName('generate')
        .setDescription('generate message')
        .addSubcommand((subcommand) =>
            subcommand
                .setName("winston-issue-message")
                .setDescription("Generate a message for submitting an issue to Winston on GitHub")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("notchnook-issue-message")
                .setDescription("Generate a message for submitting an issue to Notchnook on Linear")
        ),


    //_________COMMAND____________
    async execute(interaction): Promise<void> {

        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case "winston-issue-message":
                winstonIssueMessage(interaction)
                break
            case "notchnook-issue-message":
                notchnookIssueMessage(interaction)
            default:
                await interaction.reply("No Subcommand found")
                break
        }



    },
})

async function notchnookIssueMessage(interaction: any) {
    const embed = new EmbedBuilder()
        .setTitle("**Issue** submissions and feature **requests** for Notchnook")
        .setDescription("This is a form that allows you to submit feature requests and bug reports for Notchnoook")
        .setFields([
            { name: "🪲 Issue or Feature Request?", value: "Please tap the corresponding button for if you want to submit a feature request or a bug request" },
            // { name: "🔍 Has this feature/bug already been requested?", value: "Please check on Winstons [GitHub Page](https://github.com/lo-cafe/winston) and/or this channel <#1161562842500186213>" },
            { name: "❤️", value: "Thank you for contributing to Notchnooks development and making it the best it can be!" },
        ])

    const messageBugButton = new ButtonBuilder()
        .setLabel("Bug Report")
        .setEmoji("🪲")
        .setStyle(ButtonStyle.Primary)
    const messageFrButton = new ButtonBuilder()
        .setLabel("Feature Request")
        .setEmoji("🎁")
        .setStyle(ButtonStyle.Primary)
    const bugButton = new Button({
        data: "",
        msgBtn: messageBugButton,
        eventname: ExBtnEvent.NN_BUG_REPORT
    })
    const frButton = new Button({
        data: "",
        msgBtn: messageFrButton,
        eventname: ExBtnEvent.NN_F_REQUEST
    })
    await registerButton(bugButton)
    await registerButton(frButton)

    const row = new ActionRowBuilder()
        .addComponents([messageBugButton, messageFrButton])
    await interaction.reply({ embeds: [embed], components: [row as any] })
}


async function winstonIssueMessage(interaction: any) {
    const embed = new EmbedBuilder()
        .setTitle("GitHub Issue submissions for Winston")
        .setDescription("This is a form that allows you to submit feature requests and bug reports for Winston directly to GitHub")
        .setFields([
            { name: "🪲 Issue or Feature Request?", value: "Please tap the corresponding button for if you want to submit a feature request or a bug request" },
            { name: "🔍 Has this feature/bug already been requested?", value: "Please check on Winstons [GitHub Page](https://github.com/lo-cafe/winston) and/or this channel <#1161562842500186213>" },
            { name: "❤️", value: "Thank you for contributing to Winstons development and making it the best it can be!" },
        ])

    const messageBugButton = new ButtonBuilder()
        .setLabel("Bug Report")
        .setEmoji("🪲")
        .setStyle(ButtonStyle.Primary)
    const messageFrButton = new ButtonBuilder()
        .setLabel("Feature Request")
        .setEmoji("🎁")
        .setStyle(ButtonStyle.Primary)
    const bugButton = new Button({
        data: "",
        msgBtn: messageBugButton,
        eventname: ExBtnEvent.WINSTON_BUG_REPORT
    })
    const frButton = new Button({
        data: "",
        msgBtn: messageFrButton,
        eventname: ExBtnEvent.WINSTON_F_REQUEST
    })
    await registerButton(bugButton)
    await registerButton(frButton)

    const row = new ActionRowBuilder()
        .addComponents([messageBugButton, messageFrButton])
    await interaction.reply({ embeds: [embed], components: [row as any] })
}
