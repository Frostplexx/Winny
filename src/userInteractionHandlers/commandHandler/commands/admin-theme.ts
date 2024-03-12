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
import { writeFile } from "fs-extra";
import path from "path";
import { cacheFolder } from "../../../globals/constants";
import { handleThemeOverride, handleUploaded } from "../../../features/themesHandler/handleUploaded";

export default new SlashCommand({
    //______SLASH COMMAND OPTIONS_________
    data: new SlashCommandBuilder()
        .setName('admin-theme')
        .addSubcommand(subcommand =>
            subcommand
                .setName("override")
                .setDescription("Override a theme")
                .addAttachmentOption(a => (
                    a
                        .setName("theme")
                        .setDescription("your theme file")
                        .setRequired(true)
                ))
                .addStringOption(option => (
                    option
                        .setName("theme_id")
                        .setDescription("The ID of the theme to override")
                        .setRequired(true)
                ))

        )
        .setDescription("Manage themes"),
    //_________COMMAND____________
    async execute(interaction): Promise<void> {
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case "override":
                await overrideThemeCommand(interaction)
                break
            default:
                await interaction.reply("No Subcommand found")
                break
        }
    },
})

/**
 * Overrides a theme.
 * @param {ChatInputCommandInteraction} interaction - The interaction object.
 * @return {Promise<void>} - A Promise that resolves when the operation is complete.
 */
async function overrideThemeCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply({ephemeral: true})
    const themeFile = interaction.options.getAttachment('theme');
    const themeID = interaction.options.getString('theme_id');

    if (!themeFile) {
        await interaction.editReply({ content: "No theme file provided"});
        return;
    }

    if (!themeID) {
        await interaction.editReply({ content: "No theme ID provided"});
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
    const content = await zip.generateAsync({ type: "nodebuffer" });

    // Save the zip file in ../../cache
    await writeFile(`${cacheFolder}/${fileName}.zip`, content);
    console.log("overrideThemeCommand", "old filename: " + fileName, "theme id to override: " + themeID)
    const override = await handleThemeOverride(fileName.trim() + ".zip", themeID.trim());

    if (override.success) {
        await interaction.editReply({ content: "Theme has been overridden!" });
    } else {
        await interaction.editReply({ content: "Something went wrong: " + override.message});
    }


}


