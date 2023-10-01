import {ChatInputCommandInteraction, EmbedBuilder, Interaction, SlashCommandBuilder} from 'discord.js'
import SlashCommand from "../commandTypes/slashCommand";
import {clearCache} from "../../../globals/utils";
import * as fs from 'fs'
import {cacheFolder} from "../../../globals/constants";

export default new SlashCommand({
	//______SLASH COMMAND OPTIONS_________
	data: new SlashCommandBuilder()
		.setName('cache')
		.addSubcommand((subcommand) =>
			subcommand
				.setName("list")
				.setDescription("List all cached items")
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("clear")
				.setDescription("Clear the cache")
		)
		.setDescription("Manage cached themes"),
	//_________COMMAND____________
	async execute(interaction): Promise<void> {
		const subcommand = interaction.options.getSubcommand();
		switch (subcommand) {
			case "list":
				await listCacheCommand(interaction)
				break
			case "clear":
				await clearCacheCommand(interaction)
				break
			default:
				await interaction.reply("No Subcommand found")
				break
		}
	},
})


async function listCacheCommand(interaction: ChatInputCommandInteraction) {

	// Read directory
	fs.readdir(cacheFolder, (err, files) => {
		// Return if an error occurred
		if (err) {
			return interaction.reply({ content: `Unable to scan directory: ${err}`, ephemeral: true });
		}
		// Create an embed and add a bullet list
		const embedList = new EmbedBuilder()
			.setColor('#0099ff')
			.setTitle('Cached items')

		// Files is an array containing the names of all items in the directory
		files.forEach(function (file) {
			return embedList.addFields(
				{ name: 'Item', value: `- ${file}` }
			);
		});

		// Send the embed list of files
		return interaction.reply({embeds: [embedList], ephemeral: true})
	});
}

async function clearCacheCommand(interaction: ChatInputCommandInteraction) {
	clearCache()
	await interaction.reply({content: "Cache cleared", ephemeral: true})
}
