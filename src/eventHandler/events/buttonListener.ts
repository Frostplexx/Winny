import {BaseInteraction, Interaction} from "discord.js";
import { activeButtons } from "../../userInteractionHandlers/buttonHandler/registerButtons";
import { registeredSimpleButtonEvents } from "../../userInteractionHandlers/buttonHandler/simpleButton";
import { Event } from "../events";
import {client} from "../../main";

// Button vs SimpleButton:

// Button:
// - is saved and restored on reload of bot
// - executes one of the events found in the buttonEvents folder
// - is complicated to register and use
// SimpleButton:
// - is not saved and restored on reload of bot
// - executes a function specified while creating the button and passes an interaction and some definable data
// - is easier to register and use
export const event: Event = {
	name: "interactionCreate",
	type: "on",

	//listents to intercation via interactionCreate and checks if it's a Button
	//then checks the Button Id and executes stuff
	async execute(interaction: BaseInteraction) {
		//only listens to Buttons
		if (!interaction.isButton()) return;
		if (interaction.user.bot) return;

		//check if the Button is send by the Bot
		if (interaction.message.author.id !== client.user?.id) return;

		//gets all the active buttons and searches for our button id
		const button = activeButtons.get(interaction.customId) ?? activeButtons.get(interaction.id);
		//does the same for the registered SimpleButtonEvents
		const simpleButton =
			registeredSimpleButtonEvents.get(interaction.customId) ??
			registeredSimpleButtonEvents.get(interaction.id);
		//if the button is neither in the activeButtons nor in the registeredSimpleButtonEvents
		if (!button && !simpleButton) {
			interaction.reply({
				content: "Button does not seem to be registered",
				ephemeral: true,
			});
		} else if (!simpleButton && button) {
			//if the button is in the activeButtons
			//execute the commands execute() function
			try {
				console.log(
					`---- ButtonEvent: ${button.eventname} called by ${interaction.user.username}`
				);
				button.execute(interaction); //executes one of the button events found in the buttonEvents folder
			} catch (error) {
				console.error(error);
				await sendError(interaction, error); //sends error if something goes wrong
			}
		} else if (simpleButton) {
			//else if the button is in the registeredSimpleButtonEvents
			try {
				console.log(
					`---- SimpleButtonEvent: called by ${interaction.user.username}`
				);
				simpleButton.execute(interaction); //executes the function that we specified while creating the button
			} catch (error) {
				console.error(error);
				await sendError(interaction, error);
			}
		}
	},
};

async function sendError(interaction: any, error: unknown) {
	try {
		await interaction.reply({
			content: "There was an error while executing this command!\n" + error,
			ephemeral: true,
		});
	} catch {
		await interaction.editReply({
			content: "There was an error while executing this command!\n" + error,
		});
	}
}
