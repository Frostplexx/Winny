import { ApplicationCommand, Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import {loadAllCommands} from "./userInteractionHandlers/commandHandler/commands";
import {loadEvents} from "./eventHandler/events";
import {expressServer} from "./features/webHandler/webserver";
import {clearCache} from "./globals/utils";
import {ThemeTags} from "./database/databaseHandler";
import dotenv from "dotenv";
import {loadButtons} from "./userInteractionHandlers/buttonHandler/registerButtons";
import {bayes} from "./features/autoLabeler/bayes";

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
	await loadButtons()
	loadEvents(client);
	await loadButtons()
	// await ensureFilesExist();
	clearCache();
	await ThemeTags.sync();

	const manualWeights = {
		"bug/fix": 1.2,
		"bug=causes crash": 0.9,
		"feature/enhancement": 1.1,
		"severity/priority=low": 0.8,
		"severity/priority=medium": 1.1,
		"severity/priority=high": 0.5
	};
	await bayes(manualWeights);

	loadAllCommands(client);
	expressServer(process.env.BEARER!);

	await client.login(process.env.TOKEN);

	console.log("Logged in as " + client.user!.tag);
	client.user?.setPresence({
		status: "online",
		activities: [{ name: `/help | Version ${process.env.npm_package_version}` }],
	});
}

init();
