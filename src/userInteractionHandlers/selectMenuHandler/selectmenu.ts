import { ActionRowBuilder, SelectMenuBuilder } from "@discordjs/builders";
import { ActionRow, ButtonInteraction, ButtonStyle, Collection, SelectMenuInteraction } from "discord.js";
import { SimpleButton } from "../buttonHandler/simpleButton";
import {generateTimeBasedUUID} from "../../globals/security";

export const registeredSelectMenuEvents = new Collection<string, SelectMenuWrapper>();

export type SelMenEvent = (interaction: any, btnEvent: SelectMenuWrapper, data: any) => void;

export class SelectMenuWrapper extends SelectMenuBuilder {
	id: string;
	timestamp: number;
	constructor(private event: SelMenEvent) {
		super();
		this.event = event;

		//the button must save the id in its custom id for the button to be identified later
		this.id = this.generateButtonIdByTime();
		this.setCustomId(this.id);
		this.timestamp = new Date().getTime();
	}

	execute(interaction: SelectMenuInteraction): void {
		console.log("executing select menu");
		return this.event(interaction, this, this.data);
	}

	private generateButtonIdByTime() {
		return "10" + generateTimeBasedUUID();
	}

	/**
	 * registers the select menu to the collection
	 */
	registerSelectMenu() {
		if (registeredSelectMenuEvents.has(this.id)) console.error("Select Menu already registered: " + this.id);
		else registeredSelectMenuEvents.set(this.id, this);
		return this;
	}
	/**
	 * Use this if you have more than 25 elements in the select menu. If you use this, the select menu will be split into multiple pages.
	 * There is also no need to use .setPlaceholder() because the placeholder will be set automatically.
	 * @param {MessageActionRow} row the row to add the select menu to. This has to be a second row
	 * @param  {SelectMenuOption[]} options
	 */
	addLongOptions(options: SelectMenuOption[], row: ActionRowBuilder<any>) {
		const selmen = this;
		if (options.length <= 25) {
			this.addOptions(options);
		} else {
			let currpage = 0; //current page
			// split the options into multiple arrays of 25 elements
			const splitOptions: any[] = [];
			for (let i = 0; i < options.length; i += 25) {
				splitOptions.push(options.slice(i, i + 25));
			}
			// add first page of options to select menu
			this.addOptions(splitOptions[currpage]);
			this.setPlaceholder(`Page ${1}/${splitOptions.length}`);
			// add button to select menu to show next page of options

			/**
			 * Private next page function for button
			 * @param  {ButtonInteraction} interaction
			 */
			let _nextPage = async function (this: SimpleButton, interaction: ButtonInteraction) {
				console.log(`${interaction.user.username} clicked next page button`);
				await interaction.deferUpdate();
				const page = currpage + 1;
				const newRow = new ActionRowBuilder();
				const newRow2 = new ActionRowBuilder().addComponents([
					new SimpleButton(_prevPage).setLabel(`Prev Page`).setEmoji("⬅️").setStyle(ButtonStyle.Primary).register(),
					this,
				]);
				if (page <= splitOptions.length) {
					console.log("adding row");
					newRow.addComponents(
						//select menu wrapper that executes send quote
						new SelectMenuWrapper(selmen.event)
							.addOptions(splitOptions[page])
							.setPlaceholder(`Page ${page + 1}/${splitOptions.length}`)
							.registerSelectMenu()
					);
				}
				if (page + 1 == splitOptions.length) {
					this.setDisabled(true);
				} else if (page + 1 < splitOptions.length) {
					this.setDisabled(false);
				}
				console.log("Current page: " + currpage);
				currpage++; //increment current page
				await interaction.editReply({ content: interaction.message.content, components: [newRow as any, newRow2 as any] });
			};

			let _prevPage = async function (this: SimpleButton, interaction: ButtonInteraction) {
				console.log(`${interaction.user.username} clicked prev page button`);
				await interaction.deferUpdate();
				const page = currpage - 1;
				const newRow = new ActionRowBuilder();
				const newRow2 = new ActionRowBuilder().addComponents([
					this,
					new SimpleButton(_nextPage).setLabel(`Next Page`).setEmoji("➡️").setStyle(ButtonStyle.Primary).register(),
				]);
				if (page >= 0) {
					console.log("adding row");
					newRow.addComponents(
						new SelectMenuWrapper(this.execute)
							.addOptions(splitOptions[page])
							.setPlaceholder(`Page ${page + 1}/${splitOptions.length}`)
							.registerSelectMenu()
					);
				}
				if (page == 0) {
					this.setDisabled(true);
				} else if (page > 0) {
					this.setDisabled(false);
				}
				currpage--; //decrement current page
				await interaction.editReply({ content: interaction.message.content, components: [newRow as any, newRow2] });
			};

			const prevBtn = new SimpleButton(_prevPage)
				.setLabel(`Prev Page`)
				.setEmoji("⬅️")
				.setStyle(ButtonStyle.Primary)
				.setDisabled(true)
				.register();
			const nextBnt = new SimpleButton(_nextPage)
				.setLabel(`Next Page`)
				.setEmoji("➡️")
				.setStyle(ButtonStyle.Primary)
				.register();

			row.addComponents([prevBtn, nextBnt]);
		}

		return this;
	}
}

interface SelectMenuOption {
	label: string;
	value: string;
	description?: string;
}
