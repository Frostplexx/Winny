import {ThemeMetadata} from "./handleUploaded";
import {clientUtils} from "../../globals/utils";
import {generateEmbed, uploadThemeToDiscord} from "./discordUploader";
import {ButtonInteraction, ButtonStyle} from "discord.js";
import {SimpleButton} from "../../userInteractionHandlers/buttonHandler/simpleButton";
import {ActionRowBuilder} from "@discordjs/builders";
import {updateThemeWithID} from "../../database/databaseHandler";

export async function initiateApproval(metadata: ThemeMetadata) {
	let user = await clientUtils.findUser("336806197158215682")

	const message = "New Theme to Approve: "
	const embed = generateEmbed(metadata)
	const yesButton =
		new SimpleButton(approveTheme)
			.setLabel("Approve")
			.setEmoji("✔️")
			.setStyle(ButtonStyle.Primary)
			.register(metadata)
	const noButton =
		new SimpleButton(denyTheme)
			.setLabel("Deny")
			.setEmoji("✖️")
			.setStyle(ButtonStyle.Danger)
			.register(metadata)
	const row =
		new ActionRowBuilder()
			.addComponents([
				yesButton,
				noButton
			])
	await user.send({content: message, embeds: embed, components: [row as any]})
}

async function approveTheme(interaction: ButtonInteraction, btnEvent: SimpleButton, data: ThemeMetadata | null) {
	await interaction.deferUpdate()
	await interaction.editReply({content: "Theme approved", components: []})
	data = await uploadThemeToDiscord(data)
	if (!data) {return}
	await updateThemeWithID(data.file_id, {
		message_id: data.message_id,
		approval_state: ApprovalStates.ACCEPTED
	})
}

async function denyTheme(interaction: ButtonInteraction, btnEvent: SimpleButton, data: any) {
	console.log("Deny Theme")
	await interaction.deferUpdate()
	await interaction.editReply({content: "Theme denied", components: []})
	await updateThemeWithID(data.file_id, {
		approval_state: ApprovalStates.DENIED
	})
}

/**
 * Enum representing the possible states of an approval.
 * @enum {string}
 */
export enum ApprovalStates {
	PENDING = 'waiting for approval', // or whatever initial state
	ACCEPTED = 'accepted',
	DENIED = 'denied'
	// ... other states ...
}