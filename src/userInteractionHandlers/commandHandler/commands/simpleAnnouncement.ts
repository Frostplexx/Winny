import {
	ActionRowBuilder,
	ButtonInteraction,
	ModalSubmitInteraction,
	SlashCommandBuilder,
	TextInputBuilder, TextInputStyle
} from 'discord.js'
import SlashCommand from "../commandTypes/slashCommand";
import {ModalWrapper} from "../../modalHandler/modal";
import {Announcement, setAnnouncement} from "../../../features/announcements/getCurrentAnnouncement";

export default new SlashCommand({
	//______SLASH COMMAND OPTIONS_________
	data: new SlashCommandBuilder()
		.setName('simple-announcement')
		.setDescription('Send an announcement to Winston'),
	//_________COMMAND____________
	async execute(interaction): Promise<void> {

		const row1 = new ActionRowBuilder()
			.addComponents(
				[
					new TextInputBuilder()
						.setCustomId("title")
						.setLabel("Title of the Announcement")
						.setPlaceholder("Testlight is down again :(")
						.setRequired(true)
						.setStyle(TextInputStyle.Short),

				]
			)
		const row2 = new ActionRowBuilder()
			.addComponents([
				new TextInputBuilder()
					.setCustomId("desc")
					.setPlaceholder("A description for the announcement")
					.setLabel("Description")
					.setRequired(true)
					.setStyle(TextInputStyle.Paragraph),

			])
		const row3 = new ActionRowBuilder()
			.addComponents([
				new TextInputBuilder()
					.setCustomId("buttonLabel")
					.setLabel("Dismiss Button Label")
					.setRequired(false)
					.setPlaceholder("Done")
					.setStyle(TextInputStyle.Short),

			])
		const modal = new ModalWrapper(announcementModalEvent)
			.setTitle("Send an Announcement")
			.addComponents([row1, row2, row3] as any)
		await interaction.showModal(modal)
	},
})


async function announcementModalEvent(interaction: ModalSubmitInteraction) {
	const title = interaction.fields.getTextInputValue("title")
	const desc = interaction.fields.getTextInputValue("desc")
	const buttonLabel = interaction.fields.getTextInputValue("buttonLabel")
	const announcement = {
		name: title,
		description: desc,
		buttonLabel: buttonLabel,
		timestamp: Date.now()
	} as Announcement

	setAnnouncement(announcement)
	await interaction.reply({content: "Announcement sent", ephemeral: true})

}

