import { BaseInteraction, Events, Interaction } from "discord.js";
import { registeredSelectMenuEvents } from "../../userInteractionHandlers/selectMenuHandler/selectmenu";
import { Event } from "../events";

export const event: Event = {
	name: Events.InteractionCreate,
	type: "on",

	//listents to intercation via interactionCreate and checks if it's a ButtonTs
	//then checks the select menu Id and executes stuff
	async execute(interaction: BaseInteraction): Promise<void> {
		//only listens to select menu interactions
		if (!interaction.isSelectMenu()) return;
		if (interaction.user.bot) return;
		const selmen = registeredSelectMenuEvents.get(interaction.customId);

		if (!selmen) throw new Error("Select Menu not found");

		//execute the select menu execute() function
		try {
			console.log(
				`---- SelectMenuEvent triggered by ${interaction.user.username}`
			);
			selmen.execute(interaction);
		} catch (error) {
			console.error(error);

			try {
				(await interaction.user.createDM()).send({
					content:
						"There was an error while submitting the selection \n" +
						error,
				});
			} catch (e) {
				console.error(e);
			}
		}
	},
};
