import {ThemeMetadata} from "./handleUploaded";
import {clientUtils, getHardcodedIDs, guildUtils} from "../../globals/utils";
import {generateEmbed, uploadThemeToDiscord} from "./discordUploader";
import {ButtonInteraction, ButtonStyle, TextChannel} from "discord.js";
import {SimpleButton} from "../../userInteractionHandlers/buttonHandler/simpleButton";
import {ActionRowBuilder} from "@discordjs/builders";
import {updateThemeWithID} from "../../database/databaseHandler";
import {client} from "../../main";


//TODO: combine these two functions
export async function initiateApproval(metadata: ThemeMetadata) {
	const {channelID, guildID, themeApprovalID} = getHardcodedIDs()
	const guild = await clientUtils.findGuild(guildID)
	if (!guild) return
	const channel = await guildUtils.findChannel(guild, themeApprovalID) as TextChannel
	if (!channel) return
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
	await channel.send({content: message, embeds: embed, components: [row as any]})
}

export async function approveUpdate(metadata: ThemeMetadata) {
	const {channelID, guildID, themeApprovalID} = getHardcodedIDs()
	const guild = await clientUtils.findGuild(guildID)
	if (!guild) return
	const channel = await guildUtils.findChannel(guild, themeApprovalID) as TextChannel
	if (!channel) return
	const message = "This Theme is being Updated:"
	const embed = generateEmbed(metadata)
	const yesButton =
		new SimpleButton(approveTheme)
			.setLabel("Update Theme")
			.setEmoji("✔️")
			.setStyle(ButtonStyle.Primary)
			.register(metadata)
	const noButton =
		new SimpleButton(denyTheme)
			.setLabel("Deny Update")
			.setEmoji("✖️")
			.setStyle(ButtonStyle.Danger)
			.register(metadata)
	const row =
		new ActionRowBuilder()
			.addComponents([
				yesButton,
				noButton
			])
	await channel.send({content: message, embeds: embed, components: [row as any]})

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