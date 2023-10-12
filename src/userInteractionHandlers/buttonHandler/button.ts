/* eslint-disable no-shadow */
import {ButtonBuilder, ButtonInteraction} from "discord.js";
import {generateTimeBasedUUID} from "../../globals/security";

/**
 * Button Workflow:
 * - create MessageButton
 * - create "new Button({data, msgBtn, eventname})"
 * - call "registerButton(button)"
 * @param msgBtn: MessageButton
 * @param data: data to be used by the ButtonEvent
 * @param eventname: name of the ButtonEvent (camelCase)
 */
export class Button {
	msgBtn: ButtonBuilder;
	data: any;
	eventname: ExBtnEvent;
	id: string;
	customId: string | null;
	campaignId?: string;

	//constucter overload
	constructor({
					msgBtn,
					data,
					eventname,
					campaignId,
				}: {
		msgBtn: ButtonBuilder
		data: any;
		eventname: ExBtnEvent;
		campaignId?: string;
	});
	constructor({
					msgBtn,
					data,
					eventname,
					id,
					customId,
					campaignId,
				}: ButtonData);

	//actual constructor
	constructor({
					msgBtn,
					data,
					eventname,
					id,
					customId,
					campaignId,
				}: ButtonData) {
		this.data = data;
		this.msgBtn = msgBtn;
		this.eventname = eventname;
		this.campaignId = campaignId;

		//overload handling
		if (id && customId) {
			this.id = id;
			this.customId = customId;
		} else {
			//the button must save the id in its custom id for the button to be identified later
			this.id = this.generateButtonIdByTime();
			this.customId = this.id;
			try {
				this.msgBtn.setCustomId(this.id);
			} catch (e) {
				console.log("Error while creating button:")
				console.log(e);
			}
			msgBtn.setCustomId(this.id)
		}
	}

	private generateButtonIdByTime() {
		return "9" + generateTimeBasedUUID();
	}

	toJSON() {
		return JSON.stringify(
			{
				msgBtn: this.msgBtn,
				data: this.data,
				eventname: this.eventname,
				id: this.id,
				customId: this.customId,
				campaignId: this.campaignId,
			},
			null,
			"\t"
		);
	}
}

export interface ButtonEvent {
	name: string;
	execute: (
		interaction: ButtonInteraction,
		btnEvent: Button,
		data: any
	) => void;
}

export enum ExBtnEvent {
	BUG_REPORT = "bugReport",
	F_REQUEST = "featureRequest"
}

export type ButtonData = {
	msgBtn: ButtonBuilder;
	data: any;
	eventname: ExBtnEvent;
	id: string;
	customId: string | null;
	campaignId?: string;
};

export type genBtnType = {
	msgBtn: ButtonBuilder;
	data: any;
	eventname: ExBtnEvent;
};
