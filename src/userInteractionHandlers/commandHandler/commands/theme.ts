import {
	AttachmentBuilder,
	ChatInputCommandInteraction,
	EmbedBuilder,
	Interaction,
	SlashCommandBuilder
} from 'discord.js'
import /**
	 * Represents a slash command.
	 * @class
	 */
	SlashCommand from "../commandTypes/slashCommand";
import fs, { readFileSync, writeFileSync } from 'fs';
import JSZip from 'jszip';
import axios from "axios"
import { v4 as uuidv4 } from 'uuid';
import {writeFile} from "fs-extra";
import path from "path";
import {cacheFolder} from "../../../globals/constants";
import {handleUploaded} from "../../../features/themesHandler/handleUploaded";

export default new SlashCommand({
	//______SLASH COMMAND OPTIONS_________
	data: new SlashCommandBuilder()
		.setName('theme')
		.addSubcommand((subcommand) =>
			subcommand
				.setName("submit")
				.setDescription("Submit a theme for review")
				.addAttachmentOption( a => (
					a
						.setName("theme")
						.setDescription("your theme file")
						.setRequired(true)
				))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("fix")
				.setDescription("This command tries to fix any broken Themes")
				.addAttachmentOption( a => (
					a
						.setName("theme")
						.setDescription("your theme file")
						.setRequired(true)
				))
		)
		.setDescription("Manage themes"),
	//_________COMMAND____________
	async execute(interaction): Promise<void> {
		const subcommand = interaction.options.getSubcommand();
		switch (subcommand) {
			case "submit":
				await submitThemeCommand(interaction)
				break
			case "fix":
				await fixThemeCommand(interaction)
				break
			default:
				await interaction.reply("No Subcommand found")
				break
		}
	},
})

/**
 * Fixes the theme of a given interaction command.
 *
 * @param {ChatInputCommandInteraction} interaction - The interaction command for which the theme needs to be fixed.
 *
 * @return {Promise<void>} - Promise that resolves once the theme is fixed.
 */
const themeTemplate: Record<string, any> = {"comments":{"divider":{"style":{"no":{}},"thickness":14,"color":{"dark":{"alpha":0.5,"hex":"1C1C1E"},"light":{"alpha":0.5,"hex":"ffffff"}}},"theme":{"indentCurve":12,"innerPadding":{"horizontal":13,"vertical":6},"type":"card","cornerRadius":10,"outerHPadding":8,"repliesSpacing":0,"bodyText":{"weight":{"regular":{}},"size":17,"color":{"dark":{"alpha":1,"hex":"ffffff"},"light":{"alpha":1,"hex":"000000"}}},"indentColor":{"dark":{"alpha":0.753934148043522,"hex":"303030"},"light":{"alpha":1,"hex":"C6C6C8"}},"bodyAuthorSpacing":6,"bg":{"light":{"hex":"ffffff","alpha":1},"dark":{"hex":"313131","alpha":0.5007152639233503}},"badge":{"authorText":{"size":13,"weight":{"semibold":{}},"color":{"dark":{"alpha":0.5007152639233503,"hex":"fcfeff"},"light":{"hex":"000000","alpha":1}}},"statsText":{"weight":{"medium":{}},"size":15,"color":{"light":{"alpha":0.5,"hex":"000000"},"dark":{"hex":"ffffff","alpha":0.5}}},"spacing":5,"avatar":{"visible":true,"cornerRadius":15,"size":30}}},"spacing":10},"metadata":{"author":"aliofye","icon":"mouth","description":"Work in progress.","color":{"alpha":1,"hex":"e63b79"},"name":"Abergu"},"id":"91629E09-5E6D-41FB-912F-97D4E31C9CD3","lists":{"dividersColors":{"dark":{"hex":"3D3C41","alpha":1},"light":{"alpha":1,"hex":"C6C6C8"}},"bg":{"color":{"_0":{"light":{"alpha":1,"hex":"F2F2F7"},"dark":{"alpha":1,"hex":"171600"}}}},"foreground":{"color":{"light":{"alpha":1,"hex":"ffffff"},"dark":{"hex":"303030","alpha":0.5007152639233503}},"blurry":false}},"general":{"tabBarBG":{"blurry":true,"color":{"dark":{"hex":"ffffff","alpha":0},"light":{"alpha":0,"hex":"ffffff"}}},"navPanelBG":{"blurry":true,"color":{"dark":{"alpha":0,"hex":"313131"},"light":{"alpha":0,"hex":"ffffff"}}},"accentColor":{"dark":{"alpha":1,"hex":"0B84FE"},"light":{"hex":"3887fe","alpha":1}},"floatingPanelsBG":{"blurry":true,"color":{"light":{"alpha":0,"hex":"ffffff"},"dark":{"hex":"ffffff","alpha":0}}},"modalsBG":{"blurry":true,"color":{"dark":{"hex":"ffffff","alpha":0},"light":{"hex":"ffffff","alpha":0}}}},"posts":{"spacing":12,"badge":{"statsText":{"size":15,"color":{"light":{"alpha":0.5,"hex":"000000"},"dark":{"hex":"e63b79","alpha":1}},"weight":{"medium":{}}},"spacing":5,"authorText":{"size":13,"color":{"light":{"hex":"000000","alpha":1},"dark":{"alpha":1,"hex":"96d25f"}},"weight":{"semibold":{}}},"avatar":{"size":30,"visible":true,"cornerRadius":15}},"bodyText":{"weight":{"regular":{}},"color":{"light":{"hex":"000000","alpha":1},"dark":{"hex":"ffffff","alpha":1}},"size":17},"titleText":{"weight":{"regular":{}},"size":19,"color":{"light":{"hex":"000000","alpha":1},"dark":{"alpha":1,"hex":"ffffff"}}},"padding":{"horizontal":8,"vertical":6},"commentsDistance":16,"bg":{"color":{"_0":{"light":{"alpha":1,"hex":"F2F2F7"},"dark":{"alpha":1,"hex":"181700"}}}}},"postLinks":{"bg":{"color":{"_0":{"light":{"alpha":1,"hex":"F2F2F7"},"dark":{"hex":"171600","alpha":1}}}},"theme":{"unseenType":{"fade":{}},"innerPadding":{"horizontal":16,"vertical":14},"type":"card","verticalElementsSpacing":8,"outerHPadding":8,"cornerRadius":14,"bodyText":{"color":{"dark":{"alpha":0.75,"hex":"ffffff"},"light":{"hex":"000000","alpha":0.75}},"size":17,"weight":{"regular":{}}},"badge":{"avatar":{"size":30,"cornerRadius":15,"visible":true},"spacing":5,"authorText":{"weight":{"semibold":{}},"color":{"light":{"hex":"000000","alpha":1},"dark":{"hex":"fcfeff","alpha":0.5035765160818468}},"size":13},"statsText":{"color":{"dark":{"hex":"ffffff","alpha":0.5},"light":{"alpha":0.5,"hex":"000000"}},"weight":{"medium":{}},"size":15}},"stickyPostBorderColor":{"thickness":4,"color":{"dark":{"alpha":0.3,"hex":"2FD058"},"light":{"hex":"2FD058","alpha":0.3}}},"mediaCornerRadius":10,"titleText":{"weight":{"medium":{}},"color":{"dark":{"alpha":1,"hex":"ffffff"},"light":{"hex":"000000","alpha":1}},"size":19},"bg":{"color":{"dark":{"hex":"303030","alpha":0.5007152639233503},"light":{"hex":"ffffff","alpha":1}},"blurry":false}},"spacing":10,"divider":{"color":{"light":{"hex":"ffffff","alpha":0.5},"dark":{"hex":"303030","alpha":0.5007152639233503}},"style":{"no":{}},"thickness":6}}};

async function fixThemeCommand(interaction: ChatInputCommandInteraction): Promise<void> {
	const themeFile = interaction.options.getAttachment('theme');

	if (!themeFile) {
		await interaction.reply("No theme file provided");
		return;
	}

	const zip = new JSZip();

	// Get the data from the URL
	const response = await axios.get(themeFile.url, { responseType: 'arraybuffer' });
	const data = response.data;
	const content = await zip.loadAsync(data);

	const fileName = uuidv4()

	const themeJSONFile = content.files["theme.json"];
	if (!themeJSONFile) {
		await interaction.reply("'theme.json' not found in the zip file");
		return;
	}

	// Read and parse the 'theme.json' file
	const themeStr = await themeJSONFile.async('text');
	const theme: Record<string, any> = JSON.parse(themeStr);

	const specialCases: SpecialCases = {
		'weight': ['medium', 'semibold', 'regular', 'light'],
		"style": ["fancy", "no"]
	};

	const handleSpecialCases = (key: string, obj1: any, obj2: any) => {
		if (obj1 && obj2) {
			if (specialCases[key]) {
				const specialKeys = specialCases[key];
				for (const sKey of specialKeys) {
					if (obj1[sKey]) {
						return obj1;
					}
				}
			}
		}
		return null;
	};

	const fillMissing = (template: Record<string, any>, item: Record<string, any>) => {
		Object.entries(template).forEach(([key, value]) => {
			if (item[key] === undefined) {
				item[key] = value;
			} else if (typeof value === "object" && !Array.isArray(value) && value !== null) {
				const specialResult = handleSpecialCases(key, item[key], value);
				if (specialResult !== null) {
					item[key] = specialResult;
				} else {
					fillMissing(value, item[key]);
				}
			}
		});
	};

	fillMissing(themeTemplate, theme);


	// Update 'theme.json'
	content.file("theme.json", JSON.stringify(theme, null, 2));

	// Generate the zip file with the updated 'theme.json'
	const updatedThemeData = await content.generateAsync({ type: 'nodebuffer' });

	// Write it to a file
	const newFilepath = `./${fileName}.zip`;
	fs.writeFileSync(newFilepath, updatedThemeData);

	// Reply with the updated theme as an attachment
	const attachment = new AttachmentBuilder(newFilepath);
	await interaction.reply({ files: [attachment], ephemeral: true });

	fs.rm(newFilepath, () => {

	})
}
interface SpecialCases {
	[key: string]: string[];
}


/**
 * Displays information about the theme command.
 * @param {ChatInputCommandInteraction} interaction - The interaction object.
 * @return {Promise<void>} - A Promise that resolves when the operation is complete.
 */
async function submitThemeCommand(interaction: ChatInputCommandInteraction): Promise<void> {
	const themeFile = interaction.options.getAttachment('theme');

	if (!themeFile) {
		await interaction.reply("No theme file provided");
		return;
	}

	const zip = new JSZip();
	const fileName = uuidv4()


	// Get the data from the URL
	const response = await axios.get(themeFile.url, { responseType: 'arraybuffer' });
	const data = response.data;

	// Load the data to a zip file
	await zip.loadAsync(data);

	// Generate the content as a node buffer
	const content = await zip.generateAsync({ type:"nodebuffer" });

	// Save the zip file in ../../cache
	await writeFile(`${cacheFolder}/${fileName}.zip`, content);
	await interaction.reply({ content: "Theme has been submitted!", ephemeral: true});
	await handleUploaded(fileName + ".zip");
}