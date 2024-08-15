/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ButtonInteraction, ChatInputCommandInteraction, TextChannel } from "discord.js";
import { Button, ButtonEvent } from "../button";
import { createBugCommand, ServiceType } from "../../commandHandler/commands/issues";
export const buttonEvent: ButtonEvent = {
    name: "bugReport",
    execute: execute,
};

async function execute(
    interaction: ButtonInteraction,
    btnEvent: Button,
    data: any
) {
    if (!interaction.isButton()) return;
    await createBugCommand(interaction as unknown as ChatInputCommandInteraction, ServiceType.WINSTON)

}


