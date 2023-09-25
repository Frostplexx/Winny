import { BaseInteraction, Events } from "discord.js";
import SlashCommand from "../../userInteractionHandlers/commandHandler/commandTypes/slashCommand";
import { Event } from "../events";
import {ContextMenu} from "../../userInteractionHandlers/commandHandler/commandTypes/contextMenuCommand";
import {client} from "../../main";

export const event: Event = {
	name: Events.InteractionCreate,
	type: "on",

	//listents to intercation via interactionCreate and checks if it's a command
	//then checks the command name and executes stuff
	//-> may be improved to make it clearer for more commands
	async execute(interaction: BaseInteraction): Promise<void> {
		// Dynamically handle slash commands
		if (!interaction.isContextMenuCommand()) return;
		if (!client.commands.has(interaction.commandName)) return;

		try {
			const command: ContextMenu = client.commands.get(
				interaction.commandName
			) as unknown as ContextMenu;
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			try {
				await interaction.reply({
					content: "There was an error while executing this context menu!",
					ephemeral: true,
				});
			} catch (error) {
				interaction.followUp({
					content: "There was an error while executing this context menu!",
					ephemeral: true,
				});
			}
		}
	},
};
