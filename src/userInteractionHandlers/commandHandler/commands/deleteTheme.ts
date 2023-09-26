import {ApplicationCommandType, ContextMenuCommandBuilder} from "discord.js";
import {ContextMenu} from "../commandTypes/contextMenuCommand";
import {deleteThemeWithID, getThemeByMessageID} from "../../../databaseHandler/databaseHandler";

export default new ContextMenu({
	//______SLASH COMMAND OPTIONS_________
	data: new ContextMenuCommandBuilder()
		.setName("dev-delete-campaign")
		.setType(ApplicationCommandType.Message),
	//_________COMMAND____________
	async execute(interaction): Promise<void> {
		await interaction.deferReply({ ephemeral: true });
		const messageID = interaction.targetId;
		const theme = await getThemeByMessageID(messageID)
		if(!theme) {
			await interaction.editReply("Message is not a Theme");
			return;
		}
		const succ = await deleteThemeWithID(theme.file_id, messageID)
		if (succ) {
			await interaction.editReply("Theme deleted");
		} else {
			await interaction.editReply("Something went wrong");
		}
	},
})