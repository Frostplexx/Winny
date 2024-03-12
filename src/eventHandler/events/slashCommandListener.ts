import { BaseInteraction, Events } from "discord.js";
import { Event } from "../events";
import SlashCommand from "../../userInteractionHandlers/commandHandler/commandTypes/slashCommand";
import {client} from "../../main";

export const event: Event = {
	name: Events.InteractionCreate,
	type: "on",

	//listents to intercation via interactionCreate and checks if it's a command
	//then checks the command name and executes stuff
	//-> may be improved to make it clearer for more commands
	async execute(interaction: BaseInteraction): Promise<void> {
		// Dynamically handle slash commands
		if (!interaction.isChatInputCommand()) return;
		if (!client.commands.has(interaction.commandName)) return;
		if (!interaction.guildId) return;

		try {
			const command: SlashCommand = client.commands.get(
				interaction.commandName
			) as unknown as SlashCommand;
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			try {
				await interaction.reply({
					content: "There was an error while executing this command!",
					ephemeral: true,
				});
			} catch (error) {
				await interaction.reply({
					content: "There was an error while executing this command!",
					ephemeral: true,
				});
			}
		}
	},
};
