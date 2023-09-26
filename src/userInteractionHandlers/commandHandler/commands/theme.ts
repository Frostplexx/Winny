import {ChatInputCommandInteraction, EmbedBuilder, Interaction, SlashCommandBuilder} from 'discord.js'
import SlashCommand from "../commandTypes/slashCommand";

export default new SlashCommand({
	//______SLASH COMMAND OPTIONS_________
	data: new SlashCommandBuilder()
		.setName('theme')
		.addSubcommand((subcommand) =>
			subcommand
				.setName("delete")
				.setDescription("Delete a theme")
				.addStringOption((o) =>
					o.setName("id").setRequired(true).setDescription("The theme ID").setDescriptionLocalizations({
						de: "Die Theme ID",
					})
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("info")
				.setDescription("Get info of a Theme")
				.addStringOption((o) =>
					o.setName("id").setRequired(true).setDescription("The theme ID").setDescriptionLocalizations({
						de: "Die Theme ID",
					})
				)
		)
		.setDescription("Manage themes"),
	//_________COMMAND____________
	async execute(interaction): Promise<void> {
		const subcommand = interaction.options.getSubcommand();
		switch (subcommand) {
			case "delete":
				await deleteThemeCommand(interaction)
				break
			case "info":
				await infoThemeCommand(interaction)
				break
			default:
				await interaction.reply("No Subcommand found")
				break
		}
	},
})


async function deleteThemeCommand(interaction: ChatInputCommandInteraction) {
	interaction.reply({content: "Not implemented", ephemeral: true})
}

async function infoThemeCommand(interaction: ChatInputCommandInteraction) {
	await interaction.reply({content: "Not implemented", ephemeral: true})
}