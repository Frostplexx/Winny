import path from "path";
import { REST, Routes } from "discord.js";
import {filewalker} from "../utils";
import {clientid, token} from "../main";
const DeployableCommands: any = [];

// ------- Disable commands -------

// you can enable these command for development purposes, but they will be disabled in production
// if true the command in listOfCommands will be disabled
export const disableCommands = false;

//Enter here the names of the commands you want to disable.
//Important: the name of the command has to be the same as the name in the file!
export const listOfDisabledCommands = [
	"new-session",
	"dev-edit-campaign",
	"gen-test-campaign",
	"nuke",
	"ping",
	"migrate",
	"editCampaign",
];
// -------------------------------

export function loadAllCommands(client: any, debug: boolean = false) {
	//read commands from directory recursively

	filewalker(path.join(__dirname, "commands"), async (error: any, data: any) => {
		if (error) {
			console.error(error);
			return;
		}
		const commandFiles: Array<string> = data.filter((file: string) => file.endsWith(".ts"));
		// gets the exported command from each file
		for (const file of commandFiles) {
			try {
				const command = require(file).default;

				// Set a new item in the Collection
				// With the key as the command name and the value as the SlashCommandObject
				if (disableCommands) {
					if (listOfDisabledCommands.includes(command.data.name)) {

					} else {
						DeployableCommands.push(command.data.toJSON());
						client.commands.set(command.data.name, command);
					}
				} else {
					DeployableCommands.push(command.data.toJSON());
					client.commands.set(command.data.name, command);
				}
			} catch (_error) {
				console.error("Error: Error loading command: " + file);
				console.error(_error);
				process.exit(1);
			}
		}

		//skip deployment if debug is true
		if (!debug) {
			const rest = new REST({ version: "10" }).setToken(token as string);

			try {
				console.log("Started refreshing application (/) commands.");

				await rest.put(Routes.applicationCommands(clientid as string), {
					body: DeployableCommands,
				});
				console.log("Successfully reloaded application (/) commands.");
			} catch (error) {
				console.error(error);
			}
		}
	});
}
