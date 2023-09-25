import { ChannelType, Client, Events, Guild, PermissionFlagsBits, TextChannel } from "discord.js";
import { Event } from "../events";

// Gets executed when the bot is ready
export const event: Event = {
	name: Events.GuildCreate,
	type: "on",
	execute(guild: Guild) {
		if (guild.systemChannel != null) {
			return guild.systemChannel.send("Thank you for the invite! Please type /help to get started with the setup"), console.log("Bot Joined new server!");
		} else {
			const channel = guild.channels.cache.find(
				(channel) =>
					channel.type === ChannelType.GuildText &&
					channel.permissionsFor(guild.members.me!).has(PermissionFlagsBits.SendMessages)
			) as TextChannel;
			if (channel == null) return console.log("Error: No channel found to send message to.");
			channel.send("Thank you for the invite! Please type /help to get started with the setup");
		}
	},
};
