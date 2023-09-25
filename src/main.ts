import { ApplicationCommand, Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import {loadAllCommands} from "./commandHandler/commands";
import {loadEvents} from "./eventHandler/events";
import {expressServer} from "./webserver";
import {clearCache} from "./globals/utils";
import {ThemeTags} from "./databaseHandler/saveToDB";


export const token = "MTE1NTc4NzgxNzMwMjExNDM0Ng.GuaG99.wx8B6nAw4wAiXk9qYzURlwCKEu9NELVXdd4Yuk";
export const clientid = "1155787817302114346";

const bearer_token = "2cYk@dXT!ZjXagF_-h6x";

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
	expressServer(bearer_token)


	client.login(token).then(async () => {
		console.log("Logged in as " + client.user!.tag);
		loadEvents(client);
		client.user?.setPresence({
			status: "online",
			activities: [{ name: `/help | Version ${process.env.npm_package_version}` }],
		});

	});
})



