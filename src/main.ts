import { ApplicationCommand, Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import {loadAllCommands} from "./userInteractionHandlers/commandHandler/commands";
import {loadEvents} from "./eventHandler/events";
import {expressServer} from "./webserver";
import {clearCache} from "./globals/utils";
import {ThemeTags} from "./database/databaseHandler";
import dotenv from "dotenv";

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

clearCache()
ThemeTags.sync().then(() => {
	loadAllCommands(client);
	expressServer(process.env.BEARER!)


	client.login(process.env.TOKEN).then(async () => {
		console.log("Logged in as " + client.user!.tag);
		loadEvents(client);
		client.user?.setPresence({
			status: "online",
			activities: [{ name: `/help | Version ${process.env.npm_package_version}` }],
		});

	});
})
