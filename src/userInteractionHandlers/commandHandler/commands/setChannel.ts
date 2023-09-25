import fs from 'fs';
import { SlashCommandBuilder} from 'discord.js';
import SlashCommand from "../commandTypes/slashCommand";
import {channelsJSON} from "../../../globals/constants";

export default new SlashCommand({
	data: new SlashCommandBuilder()
		.setName('set-themes-channel')
		.setDescription('set the location of the themes channel'),

	async execute(interaction): Promise<void> {

		var channelID = interaction.channelId;
		var guildID  = interaction.guildId;

		// Create an object to store the channelID and guildID
		const data = {channelID, guildID};

		// Read the existing data from the file
		fs.readFile(channelsJSON, 'utf8', (err, fileData) => {
			if (err) {
				console.error(err);
				return;
			}

			// Convert the array back to string
			const jsonData = JSON.stringify(data, null, 2);

			// Write the new data to the file
			fs.writeFile(channelsJSON, jsonData, (err) => {
				if (err) {
					console.error(err);
					interaction.reply(String(err))
				}
			});

			interaction.reply("Themes channel set to " + interaction.channelId)
		});
	},
});