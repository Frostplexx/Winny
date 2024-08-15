
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ButtonInteraction, ChatInputCommandInteraction, TextChannel } from "discord.js";
import { Button, ButtonEvent } from "../button";
import { ServiceType, createFRCommand } from "../../commandHandler/commands/issues";
export const buttonEvent: ButtonEvent = {
    name: "nn_featureRequest",
    execute: execute,
};

async function execute(
    interaction: ButtonInteraction,
    btnEvent: Button,
    data: any
) {
    if (!interaction.isButton()) return;
    await createFRCommand(interaction as unknown as ChatInputCommandInteraction, ServiceType.NOTCHNOOK);
}


