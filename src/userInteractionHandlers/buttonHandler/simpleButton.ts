import {
	ButtonBuilder, ButtonComponent,
	ButtonComponentData,
	ButtonInteraction,
	ButtonStyle,
	Collection,
	ComponentType
} from "discord.js";
import {Button} from "./button";
import {generateTimeBasedUUID} from "../../globals/security";

export const registeredSimpleButtonEvents = new Collection<string, SimpleButton>();

export type SimpleButtonEvents = (
	interaction: ButtonInteraction,
	btnEvent: SimpleButton,
	data: any
) => void;

/**
 * @description A simple Button that can be used to execute a function. The function will be called with the interaction and the data. These buttons will not be saved! If instead you want to save the button, use the Button class.
 * @param  {SimpleButtonEvents} event
 * @param  {any} data
 */
export class SimpleButton extends ButtonBuilder{
	interaction: any;
	id: string;
	event: SimpleButtonEvents;
	data: any;
	timestamp: number;
	metadata: any
	constructor(event: SimpleButtonEvents) {
		super();
		this.event = event;
        this.id = this.generateButtonIdByTime();
		this.setCustomId(this.id);
		this.timestamp = new Date().getTime();
	}

	setData(data: any) {
		this.data = data
		return this
	}

	execute(interaction: ButtonInteraction): void {
		this.event(interaction, this, this.metadata);
	}

	private generateButtonIdByTime() {
		return "10" + generateTimeBasedUUID();
	}

	/**
	 * registers the simplebutton
	 */
	private registerSimpleButton() {
		if (registeredSimpleButtonEvents.has(this.id))
			console.error("Button already registered: " + this.id);
		else registeredSimpleButtonEvents.set(this.id, this);
	}

	register(data: any | null = null) {
		this.metadata = data
		this.registerSimpleButton();
		return this;
	}
}
