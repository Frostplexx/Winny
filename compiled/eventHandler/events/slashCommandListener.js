"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const discord_js_1 = require("discord.js");
const main_1 = require("../../main");
exports.event = {
    name: discord_js_1.Events.InteractionCreate,
    type: "on",
    //listents to intercation via interactionCreate and checks if it's a command
    //then checks the command name and executes stuff
    //-> may be improved to make it clearer for more commands
    async execute(interaction) {
        // Dynamically handle slash commands
        if (!interaction.isChatInputCommand())
            return;
        if (!main_1.client.commands.has(interaction.commandName))
            return;
        try {
            const command = (await main_1.client.commands.get(interaction.commandName));
            await command.execute(interaction);
        }
        catch (error) {
            console.error(error);
            try {
                await interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            }
            catch (error) {
                interaction.followUp({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            }
        }
    },
};
