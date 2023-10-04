import fs from "fs";
import path from "path";
import {ThemeMetadata} from "./handleUploaded";
import {clientUtils, getHardcodedIDs, guildUtils} from "../../globals/utils";
import {
	ActionRowBuilder,
	AttachmentBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	TextBasedChannel
} from "discord.js";
import {cacheFolder} from "../../globals/constants";
import {getThemePreviewImage} from "../svgEditor";
import {uploadToBucket} from "../webHandler/S3Buckets/uploadToBucket";

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

	const previews = getThemePreviewImage(metadata)

	let guild = await clientUtils.findGuild(guildID)
	if (!guild) {return null}
	let channel = await guildUtils.findChannel(guild, channelID) as TextBasedChannel
	let embed = generateEmbed(metadata)

	let filename = metadata.file_name
	let filePath = path.join(cacheFolder, filename)


	await waitForFiles(previews);
	console.log(previews)

	//upload to S3 storage
	await uploadToBucket(filePath, previews.filter( p => {p.includes("light")}), previews.filter( p => {p.includes("dark")}))

	const button = new ButtonBuilder()
		.setLabel("Download Theme")
		.setEmoji("⬇️")
		.setStyle(ButtonStyle.Link)
		.setURL(process.env.BOT_URL + "/themes/redirect/" + metadata.file_name)
	const row = new ActionRowBuilder()
		.addComponents(button)


	const attachments = previews.map(p => {
		return new AttachmentBuilder(p)
	})

	let send = await channel.send({embeds: embed, files: attachments, components: [row as any]})
	metadata.message_id = send.id

	fs.rm(filePath, (err) => {
		if (err) {
			console.error(`Error deleting file at ${filePath}:`, err);
		} else {
			console.info(`Successfully deleted file at ${filePath}`);
		}
	})

	previews.forEach(p => {
		fs.rm(p, (err) => {
			if (err) {
				console.error(`Error deleting file at ${filePath}:`, err);
			} else {
				console.info(`Successfully deleted file at ${filePath}`);
			}
		})
	})

	return metadata
}


/**
 * Generates an embed object from the given metadata.
 *
 * @param {ThemeMetadata} metadata - The metadata object containing information about the theme.
 * @return {EmbedBuilder} - The generated embed object.
 */
export function generateEmbed(metadata: ThemeMetadata): EmbedBuilder[] {
	// inside a command, event listener, etc.
	const colorInt = parseInt(metadata.color.hex.replace('#',''), 16);
	let symbol ="https://github.com/andrewtavis/sf-symbols-online/blob/master/glyphs/" + metadata.icon + ".png"
	console.log(symbol)
	return  [
		new EmbedBuilder()
			.setURL("https://winston.cafe") //needed to combine embed: https://www.reddit.com/r/discordapp/comments/raz4kl/finally_a_way_to_display_multiple_images_in_an/
			.setColor(colorInt)
			.setTitle(metadata.theme_name)
			.setAuthor({ name: metadata.theme_author})
			.setThumbnail("https://raw.githubusercontent.com/Kinark/winston/main/winston/Assets.xcassets/AppIcon.appiconset/Frame%207-1024.png")
			.setDescription(metadata.theme_description == "" ? "No description" : metadata.theme_description)
			.setImage("attachment://light-" + metadata.file_id + ".png")
			.setTimestamp()
			.setFooter({ text: 'Theme ID: ' + metadata.file_id}),
		new EmbedBuilder()
			.setURL("https://winston.cafe") //needed to combine embeds: https://www.reddit.com/r/discordapp/comments/raz4kl/finally_a_way_to_display_multiple_images_in_an/
			.setImage("attachment://dark-" + metadata.file_id + ".png")
	]
}

/**
 * Wait until the specified files exist.
 *
 * @param {string[]} fileNames - The names of the files to wait for.
 * @returns {Promise<void>} - A promise that resolves when all the files exist.
 */
async function waitForFiles(fileNames: string[]): Promise<void> {
	for (const fileName of fileNames) {
		await new Promise((resolve) => {
			const interval = setInterval(() => {
				if (fs.existsSync(fileName)) {
					clearInterval(interval);
					resolve(null);
				}
			}, 500); // Check every 500ms
		});
	}
}
