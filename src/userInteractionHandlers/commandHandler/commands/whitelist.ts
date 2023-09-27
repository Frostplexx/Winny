import {ChatInputCommandInteraction, EmbedBuilder, Interaction, SlashCommandBuilder} from 'discord.js'
import SlashCommand from "../commandTypes/slashCommand";
import {clearCache} from "../../../globals/utils";
import * as fs from 'fs'
import {cacheFolder} from "../../../globals/constants";
import {
	addUserToWhitelist,
	getUserEligibility,
	isUserInWhitelist,
	removeUserFromWhitelist
} from "../../../globals/security";

export default new SlashCommand({
	//______SLASH COMMAND OPTIONS_________
	data: new SlashCommandBuilder()
		.setName('whitelist')
		.addSubcommand((subcommand) =>
			subcommand
				.setName("add")
				.setDescription("Add a user to the whitelist")
				.addStringOption(o => (
					o
						.setName("client-id")
						.setDescription("ID of the Winston client")
						.setRequired(true)
				))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("remove")
				.setDescription("Remove a user from the whitelist")
				.addStringOption(o => (
					o
						.setName("client-id")
						.setDescription("ID of the Winston client")
						.setRequired(true)
				))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("check")
				.setDescription("Check if a user is on the whitelist")
				.addStringOption(o => (
					o
						.setName("client-id")
						.setDescription("ID of the Winston client")
						.setRequired(true)
				))
		)
		.setDescription("Manage the whitelist for the theme store"),
	//_________COMMAND____________
	async execute(interaction): Promise<void> {
		const subcommand = interaction.options.getSubcommand();
		switch (subcommand) {
			case "add":
				await addUserToWhitelistCommand(interaction)
				break
			case "remove":
				await removeUserFromWhitelistCommand(interaction)
				break
			case "check":
				await checkUserInWhitelistCommand(interaction)
				break
			default:
				await interaction.reply("No Subcommand found")
				break
		}
	},
})

async  function checkUserInWhitelistCommand(interaction: ChatInputCommandInteraction) {
	const id = interaction.options.getString("client-id") ?? ""
	if (!id) {
		await interaction.reply({content: "Error with getting the id", ephemeral: true})
	} else {
		const elig = await isUserInWhitelist(id)
		if (elig) {
			await  interaction.reply({content: "User is in whitelist", ephemeral: true})
		} else {
			await  interaction.reply({content: "User is not in whitelist", ephemeral: true})
		}
	}
}
async function addUserToWhitelistCommand(interaction: ChatInputCommandInteraction) {
	const id = interaction.options.getString("client-id") ?? ""
	if (!id) {
		await interaction.reply({content: "Error with getting the id", ephemeral: true})
	} else {
		await addUserToWhitelist(id)
		await interaction.reply({content: "User has been added to whitelist!", ephemeral: true})
	}
}

async function removeUserFromWhitelistCommand(interaction: ChatInputCommandInteraction) {
	const id = interaction.options.getString("client-id") ?? ""
	if (!id) {
		await interaction.reply({content: "Error with getting the id", ephemeral: true})
	} else {
		await removeUserFromWhitelist(id)
		await interaction.reply({content: "User has been removed from whitelist!", ephemeral: true})
	}
}