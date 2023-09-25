import { SlashCommandBuilder} from 'discord.js'
import SlashCommand from "../commandTypes/slashCommand";

export default new SlashCommand({
	//______SLASH COMMAND OPTIONS_________
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('help command'),
	//_________COMMAND____________
	async execute(interaction): Promise<void> {
		await interaction.reply("Not implemented")
	},
})
