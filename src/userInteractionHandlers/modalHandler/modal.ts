import {
	ActionRow,
	Collection,
	ModalSubmitInteraction,
	TextInputComponent,
} from "discord.js";
import {ModalBuilder} from "discord.js";
import {generateTimeBasedUUID} from "../../globals/security";

export const registeredModalEvents = new Collection<string, ModalWrapper>();

export type ModalEvent = (interaction: ModalSubmitInteraction, btnEvent: ModalWrapper, data: any) => void;

/**
 * @description Wrapps a Modal to be called my the general event handler
 * @use new ModalWrapper(event).setTitle(title).addComponents(comp).send()
 * -------------
 * @param event - ModalEvent: function to be called when the modal is send
 * Has access to:
 *  - interaction: ButtonInteraction
 *  - data: the stored Data
 * @param data - any: use this object to store data you need in the event. It is advisable to make a interface for this, see "PlayerRequestModalData"
 */
export class ModalWrapper extends ModalBuilder {
	id: string;
	timestamp: number;
	constructor(private readonly event: ModalEvent) {
		super();
		this.event = event;
		//the button must save the id in its custom id for the button to be identified later
		this.id = this.generateButtonIdByTime();
		this.setCustomId(this.id);
		this.timestamp = new Date().getTime();
		this.registerModal();
	}

	setTitle(title: string): this {
		return super.setTitle(title);
	}

	setCustomId(customId: string): this {
		return super.setCustomId(customId);
	}


	execute(interaction: any): void {
		this.event(interaction, this, this.data);
	}

	private generateButtonIdByTime() {
	return "7" + generateTimeBasedUUID();
	}

	/**
	 * registers the modal event
	 */
	private registerModal() {
		if (registeredModalEvents.has(this.id)) console.error("Modal already registered: " + this.id);
		else {
			registeredModalEvents.set(this.id, this);
			console.log("Modal registered: " + this.id);

		}
	}
}
