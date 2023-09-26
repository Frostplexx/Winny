import fs from "fs";
import path from "path";
import {ThemeMetadata} from "./handleUploaded";
import {clientUtils, getHardcodedIDs, guildUtils} from "../globals/utils";
import {AttachmentBuilder, EmbedBuilder, TextBasedChannel} from "discord.js";
import {cacheFolder} from "../globals/constants";

/**
 * Uploads a theme to Discord.
 *
 * @param {ThemeMetadata | null} metadata - The metadata of the theme to upload.
 * @returns {Promise<ThemeMetadata | null>} - The updated metadata of the uploaded theme, or null if no metadata is provided.
 */
export async function uploadThemeToDiscord(metadata: ThemeMetadata | null): Promise<ThemeMetadata | null> {
	if (metadata == null) {
		return null;
	}

	const {guildID, channelID} = getHardcodedIDs();

	let guild = await clientUtils.findGuild(guildID)
	if (!guild) {return null}
	let channel = await guildUtils.findChannel(guild, channelID) as TextBasedChannel
	let embed = generateEmbed(metadata)

	let filename = metadata.file_name
	let filePath = path.join(cacheFolder, filename)

	let attachments = new AttachmentBuilder(filePath)
	let send = await channel.send({embeds: [embed], files: [attachments]})

	fs.rm(filePath, (err) => {
		if (err) {
			console.error(`Error deleting file at ${filePath}:`, err);
		} else {
			console.info(`Successfully deleted file at ${filePath}`);
		}
	})

	metadata.message_id = send.id
	metadata.attachment_url = send.attachments.first()!.url


	return metadata
}

/**
 * Generates an embed object from the given metadata.
 *
 * @param {ThemeMetadata} metadata - The metadata object containing information about the theme.
 * @return {EmbedBuilder} - The generated embed object.
 */
export function generateEmbed(metadata: ThemeMetadata): EmbedBuilder {
	// inside a command, event listener, etc.
	const colorInt = parseInt(metadata.color.hex.replace('#',''), 16);
	let symbol ="https://github.com/andrewtavis/sf-symbols-online/blob/master/glyphs/" + metadata.icon + ".png"
	console.log(symbol)
	return  new EmbedBuilder()
		.setColor(colorInt)
		.setTitle(metadata.theme_name)
		.setAuthor({ name: metadata.theme_author})
		.setDescription(metadata.theme_description == "" ? "No description" : metadata.theme_description)
		.setTimestamp()
		.setFooter({ text: 'Theme ID: ' + metadata.file_id});
}
