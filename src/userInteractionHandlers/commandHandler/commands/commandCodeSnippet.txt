import { SlashCommandBuilder} from 'discord.js'
import SlashCommand from "../commandTypes/slashCommand";

export default new SlashCommand({
	//______SLASH COMMAND OPTIONS_________
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('help command'),
	//_________COMMAND____________
	async execute(interaction): Promise<void> {
		await interaction.reply('`/add-legacy-point` to add points. `/subtract-legacy-points` to subtract them. `/points` to see how many points you have')
	},
})
