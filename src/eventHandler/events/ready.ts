import { Client, Events } from "discord.js";
import { Event } from "../events";

// Gets executed when the bot is ready
export const event: Event = {
	name: Events.ClientReady,
	type: "once",
	execute(client: Client) {
		console.log(
		`Bot: ${client.user?.tag} | v${process.env.npm_package_version}\nNode: ${process.version}\nDiscord.js: ${require("discord.js").version}\n`
		);
	},
};