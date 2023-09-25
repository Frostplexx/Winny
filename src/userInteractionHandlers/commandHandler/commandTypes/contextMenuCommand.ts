import {
	ContextMenuCommandBuilder,
	ContextMenuCommandInteraction,
	REST,
	Routes
} from "discord.js";
import fs from "fs";


//conexts menus are loaded together with the commands
export class ContextMenu {
	data: ContextMenuCommandBuilder;
	execute: (interaction: ContextMenuCommandInteraction) => Promise<void> | void;

	constructor(options: {
		data: ContextMenuCommandBuilder;
		execute: (interaction: ContextMenuCommandInteraction) => Promise<void> | void;
	}) {
		this.data = options.data;
		this.execute = options.execute;
	}
}

