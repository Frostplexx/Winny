"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.clientid = exports.token = void 0;
const discord_js_1 = require("discord.js");
const commands_1 = require("./commandHandler/commands");
const events_1 = require("./eventHandler/events");
exports.token = "MTE1NTc4NzgxNzMwMjExNDM0Ng.GuaG99.wx8B6nAw4wAiXk9qYzURlwCKEu9NELVXdd4Yuk";
exports.clientid = "1155787817302114346";
// Create a new client instance
exports.client = Object.assign(new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildMessageReactions,
        discord_js_1.GatewayIntentBits.GuildMessageTyping,
    ],
    partials: [discord_js_1.Partials.Channel],
}), {
    commands: new discord_js_1.Collection(),
});
(0, commands_1.loadAllCommands)(exports.client);
exports.client.login(exports.token).then(async () => {
    var _a;
    console.log("Logged in as " + exports.client.user.tag);
    (0, events_1.loadEvents)(exports.client);
    (_a = exports.client.user) === null || _a === void 0 ? void 0 : _a.setPresence({
        status: "online",
        activities: [{ name: `/help | Version ${process.env.npm_package_version}` }],
    });
});
