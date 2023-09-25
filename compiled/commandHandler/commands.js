"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAllCommands = exports.listOfDisabledCommands = exports.disableCommands = void 0;
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const discord_js_1 = require("discord.js");
const utils_1 = require("../utils");
const main_1 = require("../main");
const DeployableCommands = [];
// ------- Disable commands -------
// you can enable these command for development purposes, but they will be disabled in production
// if true the command in listOfCommands will be disabled
exports.disableCommands = false;
//Enter here the names of the commands you want to disable.
//Important: the name of the command has to be the same as the name in the file!
exports.listOfDisabledCommands = [
    "new-session",
    "dev-edit-campaign",
    "gen-test-campaign",
    "nuke",
    "ping",
    "migrate",
    "editCampaign",
];
// -------------------------------
function loadAllCommands(client, debug = false) {
    //read commands from directory recursively
    (0, utils_1.filewalker)(path_1.default.join(__dirname, "commands"), async (error, data) => {
        if (error) {
            console.error(error);
            return;
        }
        const commandFiles = data.filter((file) => file.endsWith(".ts"));
        // gets the exported command from each file
        for (const file of commandFiles) {
            try {
                const command = require(file).default;
                // Set a new item in the Collection
                // With the key as the command name and the value as the SlashCommandObject
                if (exports.disableCommands) {
                    if (exports.listOfDisabledCommands.includes(command.data.name)) {
                    }
                    else {
                        DeployableCommands.push(command.data.toJSON());
                        client.commands.set(command.data.name, command);
                    }
                }
                else {
                    DeployableCommands.push(command.data.toJSON());
                    client.commands.set(command.data.name, command);
                }
            }
            catch (_error) {
                console.error("Error: Error loading command: " + file);
                console.error(_error);
                process.exit(1);
            }
        }
        //skip deployment if debug is true
        if (!debug) {
            const rest = new discord_js_1.REST({ version: "10" }).setToken(main_1.token);
            try {
                console.log("Started refreshing application (/) commands.");
                await rest.put(discord_js_1.Routes.applicationCommands(main_1.clientid), {
                    body: DeployableCommands,
                });
                console.log("Successfully reloaded application (/) commands.");
            }
            catch (error) {
                console.error(error);
            }
        }
    });
}
exports.loadAllCommands = loadAllCommands;
