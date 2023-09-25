import { ButtonInteraction, Collection, Message } from "discord.js";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { Button, ButtonEvent } from "./button";

//all registered Buttons
export const activeButtons = new Collection<string, ExecutableButton>();

const btnPath = path.join(__dirname, "..", "..", "data", "buttons.json");

/**
 * Button Workflow:
 * - create MessageButton
 * - create "new Button({data, msgBtn, eventname})"
 * - call "registerButton(button)"
 * @param button
 * @param update
 */
export async function registerButton(button: Button, update = true) {
	const execBtn = new ExecutableButton(button);
	activeButtons.set(execBtn.id, execBtn);

	if (update) {
		//updates the stored active buttons
		await saveActiveButtons();
	}
}

/**
 * @description Deletes a Button from the activeButtons, leaves the discord message untouched
 * @param button
 */
export async function unregisterButton(button: Button) {
	activeButtons.delete(button.id);
	//updates the stored active buttons
	await saveActiveButtons();
}

/**
 * @description Deletes a Button from everywhere and updated storage
 * @param button
 * @param msg
 * @param option
 */
export async function removeButton(
	button: Button,
	msg: Message,
	option: "delete" | "disable" = "disable"
) {
	await unregisterButton(button);
}

/**
 * overwrites the button.json with all current buttons
 */
async function saveActiveButtons() {
	let btns = "";
	let count = 0;
	for (const execBtn of activeButtons.values()) {
		btns += execBtn.toJSON() + ",";
		count++;
	}
	btns = btns.slice(0, btns.length - 1); //deletes trailing comma
	const json = `{
    "buttons": [
      ${btns}
    ]
  }`;
	writeFileSync(btnPath, json, "utf8"); // write it back
	console.log(`Saved ${count} out of ${activeButtons.size} active buttons`);
}

async function loadPreviouslyActiveButtons() {
	if (!existsSync(btnPath)) {
		writeFileSync(btnPath, JSON.stringify({ buttons: [] }));
		return;
	}
	const json = JSON.parse(readFileSync(btnPath, "utf-8"));
	const dataArray: any = json.buttons;
	//checks if btns exist
	if (!dataArray) {
		console.log("No saved Buttons found");
		return;
	}

	for (const data of dataArray) {
		const btn = new Button({
			data: data.data,
			eventname: data.eventname,
			msgBtn: data.msgBtn,
			id: data.id,
			customId: data.customId,
			campaignId: data.campaignId,
		});
		// delete buttons where campaign doesnt exist anymore
		// if (cmp) {
		// 	registerButton(btn, false);
		// 	console.log(`Registered Button ${btn.customId} - id:${btn.id}`);
		// } else {
		// 	unregisterButton(btn);
		// 	console.log(`Removed Button ${btn.customId} - id:${btn.id}`);
		// }
		registerButton(btn, false);
		console.log(`Registered Button ${btn.customId} - id:${btn.id}`);
	}
}

export async function loadButtons() {
	loadButtonEvents();
	await loadPreviouslyActiveButtons();
}
//----------------------------------------------

//all loaded ButtonEvents
export const buttonEvents = new Collection<string, ButtonEvent>();

function loadButtonEvents() {
	//read events from the buttonEvents folder
	const eventFiles = readdirSync(__dirname + "/buttonEvents").filter((file) =>
		file.endsWith(".ts")
	);
	//gets the exported ButtonEvent from each file
	for (const file of eventFiles) {
		//gets the ButtonEvent from the file
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const btnEvent: ButtonEvent = require(__dirname + `/buttonEvents/${file}`).buttonEvent;
		//saves the Event to be used by various Buttons
		buttonEvents.set(btnEvent.name, btnEvent);
	}
}

class ExecutableButton extends Button {
	private btnEvent: ButtonEvent;

	constructor(button: Button);
	constructor(button: Button) {
		super(button);
		//gets the buttonEvent, throws error if none found
		this.btnEvent =
			buttonEvents.get(button.eventname) ??
			(() => {
				throw Error(
					"Could not create ExecutableButton: No ButtonEvent matching eventname found!"
				);
			})();
	}
	execute(interaction: ButtonInteraction): void {
		this.btnEvent.execute(interaction, this, this.data);
	}
}
