"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const slashCommand_1 = tslib_1.__importDefault(require("../commandTypes/slashCommand"));
const user_1 = require("../../userHandler/user");
exports.default = new slashCommand_1.default({
    //______SLASH COMMAND OPTIONS_________
    data: new discord_js_1.SlashCommandBuilder()
        .setName('user')
        .addSubcommandGroup(group => group
        .setName('get')
        .setDescription('Get user info')
        .addSubcommand(subcommand => subcommand
        .setName('points')
        .setDescription('Get the points of a user')
        .addUserOption(option => option.setName('user').setDescription('The user to get the points of').setRequired(true)))
        .addSubcommand(subcommand => subcommand
        .setName('score')
        .setDescription('Get the score of a user')
        .addUserOption(option => option.setName('user').setDescription('The user to get the score of').setRequired(true))))
        .setDescription('user commands'),
    //_________COMMAND____________
    async execute(interaction) {
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();
        const user = interaction.options.getUser('user');
        if (!user)
            return;
        if (subcommandGroup === 'get') {
            if (subcommand === 'points') {
                const points = (0, user_1.getPoints)(user.id, user_1.pointTypes.POINTS);
                if (points) {
                    await interaction.reply(`${user.username}'s legacy points: ${points}`);
                }
                else {
                    await interaction.reply(`Could not get ${user.username}'s points`);
                }
            }
            else if (subcommand === 'score') {
                const points = (0, user_1.getPoints)(user.id, user_1.pointTypes.SCORE);
                console.log(points);
                if (points) {
                    await interaction.reply(`${user.username}'s score: ${points}`);
                }
                else {
                    await interaction.reply(`Could not get ${user.username}'s score`);
                }
            }
        }
    },
});
