import {BaseInteraction, ChatInputCommandInteraction, Client, Events, Guild, Interaction} from "discord.js";
import {readdirSync} from "fs";

//loads all the events found in the events folder
export function loadEvents(client: Client) {
	try {
		//same as commands but for events
		const eventFiles = readdirSync(__dirname + "/events").filter((file) =>
			file.endsWith(".ts")
		);

		/* The Client class in discord.js extends the EventEmitter class.
	Therefore, the client object exposes the .on() and .once() methods that you can use to register event listeners.
	These methods take two arguments: the event name and a callback function.
		 */
		for (const file of eventFiles) {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const event: Event = require(__dirname + `/events/${file}`).event;

			//registers the Events
			if (event.type === "once") {
				client.once(event.name, (interaction) =>
					event.execute(interaction)
				);
			} else if (event.type === "on") {
				client.on(event.name, (interaction) =>
					event.execute(interaction)
				);
			}
		}
	} catch (err) {
		console.error("Critical error caught in events.ts\n" + err);
	}
}

export interface Event {
	name: string;
	type: "once" | "on";
	execute: ((interaction: BaseInteraction) => void) | ((client: Client) => void) | ((guild: Guild) => void);
}