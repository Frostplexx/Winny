/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Button, ButtonEvent } from "../button";
import { disableMsgButtons } from "../buttons.util";
import { activeButtons, removeButton } from "../registerButtons";
import {ButtonBuilder, ButtonInteraction, ButtonStyle, TextChannel} from "discord.js";
import {resolveInteractionMessage} from "../../../globals/utils";
import {ActionRowBuilder} from "@discordjs/builders";
import {ApprovalButtons} from "../../../features/themesHandler/approvalHandler";
import {ThemeMetadata} from "../../../features/themesHandler/handleUploaded";
export const buttonEvent: ButtonEvent = {
	name: "sendApproval",
	execute: execute,
};

async function execute(
	interaction: ButtonInteraction,
	btnEvent: Button,
	data: ApprovalEventData
) {
	if (!interaction.isButton()) return;

	console.log("JoinButtonReply received: " + data.state);

	// disables already pressed buttons
	const btnJSONYes = JSON.stringify(data.btns.btnYes);
	const btnJSONNo = JSON.stringify(data.btns.btnNo);

	let msg = await resolveInteractionMessage(
		interaction.message,
        (interaction.channel as TextChannel)!
	);

	removeButton(
		activeButtons.get(JSON.parse(btnJSONYes).custom_id) as Button,
		msg
	);
	removeButton(
		activeButtons.get(JSON.parse(btnJSONNo).custom_id) as Button,
		msg
	);
}


export interface ApprovalEventData {
	btns: ApprovalButtons;
	userId: string;
	metadata: ThemeMetadata;
	state: boolean;
}

