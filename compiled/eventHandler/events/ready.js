"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const discord_js_1 = require("discord.js");
// Gets executed when the bot is ready
exports.event = {
    name: discord_js_1.Events.ClientReady,
    type: "once",
    execute(client) {
        var _a;
        console.log(`Bot: ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag} | v${process.env.npm_package_version}\nNode: ${process.version}\nDiscord.js: ${require("discord.js").version}\n`);
    },
};
