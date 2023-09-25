"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const slashCommand_1 = tslib_1.__importDefault(require("../commandTypes/slashCommand"));
exports.default = new slashCommand_1.default({
    //______SLASH COMMAND OPTIONS_________
    data: new discord_js_1.SlashCommandBuilder()
        .setName('help')
        .setDescription('help command'),
    //_________COMMAND____________
    async execute(interaction) {
        await interaction.reply('`/add-legacy-point` to add points. `/subtract-legacy-points` to subtract them. `/points` to see how many points you have');
    },
});
