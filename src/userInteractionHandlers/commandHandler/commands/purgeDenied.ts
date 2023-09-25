import { SlashCommandBuilder} from 'discord.js'
import SlashCommand from "../commandTypes/slashCommand";
import {ThemeTags} from "../../../databaseHandler/databaseHandler";
import {ApprovalStates} from "../../../themesHandler/approvalHandler";

export default new SlashCommand({
	//______SLASH COMMAND OPTIONS_________
	data: new SlashCommandBuilder()
		.setName('purge-denied')
		.setDescription('Purge all denied Themes'),
	//_________COMMAND____________
	async execute(interaction): Promise<void> {
		//code here
		try {
			await ThemeTags.destroy({
				where: {
					approval_state: ApprovalStates.DENIED
				}
			});
			await interaction.reply({content: "Succesfully purged denied themes", ephemeral: true})
		} catch (error) {
			console.error(error);
			await interaction.reply({content: "Error: " + error, ephemeral: true})
		}
	},
})
