"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const slashCommand_1 = tslib_1.__importDefault(require("../commandTypes/slashCommand"));
const openai_1 = require("../../openai");
exports.default = new slashCommand_1.default({
    //______SLASH COMMAND OPTIONS_________
    data: new discord_js_1.SlashCommandBuilder()
        .setName('brombt')
        .addStringOption(option => option.setName('text').setDescription('The text to be brombed').setRequired(true))
        .setDescription('brömbt'),
    //_________COMMAND____________
    async execute(interaction) {
        const text = interaction.options.getString('text');
        await interaction.deferReply();
        try {
            const completion = await openai_1.openai.createCompletion({
                model: "text-davinci-002",
                prompt: text,
            });
            const res = completion.data.choices[0].text;
            console.log(completion.data);
            if (!res) {
                await interaction.editReply("Something went wrong \n" + completion.status.toString() + "\n" + completion.statusText.toString());
            }
            else {
                await interaction.editReply("Prompt: " + text + res);
            }
        }
        catch (error) {
            await interaction.editReply("Something went wrong \n" + error.toString());
        }
    },
});
