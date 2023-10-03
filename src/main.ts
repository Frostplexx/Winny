import { ApplicationCommand, Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import {loadAllCommands} from "./userInteractionHandlers/commandHandler/commands";
import {loadEvents} from "./eventHandler/events";
import {expressServer} from "./features/webHandler/webserver";
import {clearCache} from "./globals/utils";
import {ThemeTags} from "./database/databaseHandler";
import dotenv from "dotenv";
import {ensureFilesExist} from "./globals/startup";

dotenv.config({ path: "./.env" });
// Create a new client instance
export const client = Object.assign(
	new Client({
		intents: [
			GatewayIntentBits.GuildVoiceStates,
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildMessageReactions,
			GatewayIntentBits.GuildMessageTyping,
		],
		partials: [Partials.Channel],
	}),
	{
		commands: new Collection<string, ApplicationCommand>(),
	}
);

async function init() {
	// await ensureFilesExist();
	clearCache();
	await ThemeTags.sync();

	loadAllCommands(client);
	expressServer(process.env.BEARER!);

	await client.login(process.env.TOKEN);

	console.log("Logged in as " + client.user!.tag);
	loadEvents(client);
	client.user?.setPresence({
		status: "online",
		activities: [{ name: `/help | Version ${process.env.npm_package_version}` }],
	});
}

init();
