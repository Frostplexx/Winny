import {ButtonBuilder, ComponentType, Message} from "discord.js";
import {Button} from "./button";

/**
 * @description Disable a Button in a Message
 * @param message Message you want to edit
 * @param buttonIndex
 */
export function disableMsgButtonIndex(message: Message, buttonIndex: number) {
	const messageContent = message.content;
	const row = message.components[0];
	(row.components[buttonIndex] as unknown as ButtonBuilder).setDisabled(true);
	message.edit({ content: messageContent, components: [row] });
}

/**
 * @description Enable a Button in a Message
 * -------------
 * @param message Message you want to edit
 * @param ButtonIndex Specifies which button in the Array. From left to right, starts with 0
 */
export function enableButton(message: Message, buttonId: string): void {
	const messageContent = message.content;
	const row = message.components[0];
	row.components
		.filter((cmp) => cmp.type === ComponentType.Button && cmp.customId === buttonId)
		.forEach((cmp) => {});//TODO cmp.setDisabled(false));
	message.edit({ content: messageContent, components: [row] });
}
/**
 * @description enable a button in a message
 * @param  {Message<boolean>} message
 * @param  {number} ButtonIndex
 */
export function enableButtonIndex(
	message: Message<boolean>,
	ButtonIndex: number
) {
	const messageContent = message.content;
	const row = message.components[0];
	// row.components[ButtonIndex].setDisabled(false);
	message.edit({ content: messageContent, components: [row] });
}
