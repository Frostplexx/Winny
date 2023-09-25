import { InteractionType } from "discord-api-types/v9";
import { BaseInteraction, Events, Interaction, ModalSubmitInteraction } from "discord.js";
import { registeredModalEvents } from "../../userInteractionHandlers/modalHandler/modal";
import { Event } from "../events";

export const event: Event = {
	name: Events.InteractionCreate,
	type: "on",

	//listents to intercation via interactionCreate and checks if it's a ButtonTs
	//then checks the modal Id and executes stuff
	async execute(interaction: BaseInteraction): Promise<void> {
		//only listens to Modals
		if (interaction.type !== InteractionType.ModalSubmit) return;
		if (!(interaction instanceof ModalSubmitInteraction)) return;
		console.log(interaction.customId);
		const modal = registeredModalEvents.get(interaction.customId);

		if (!modal) throw new Error("Modal not found");

		//execute the modal execute() function
		try {
			console.log(`---- ModalEvent triggered by ${interaction.user.username}`);
			modal.execute(interaction);
			//delete the modal from the registeredModalEvents after it has been executed
			registeredModalEvents.delete(interaction.customId);
		} catch (error) {
			console.error(error);

			try {
				(await interaction.user.createDM()).send({
					content: "There was an error while submitting the form \n" + error,
				});
			} catch (e) {
				console.error(e);
			}
		}
	},
};
