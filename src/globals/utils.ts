import fs from 'fs';
import path from 'path';
import {cacheFolder} from "./constants";
import {Guild, Message, TextChannel} from "discord.js";
import {APIMessage} from "discord-api-types/payloads/v9/channel";
import {client} from "../main";

/**
 * Clears the ./src/cache folder.
 */
export function clearCache() {
	const cacheFolderPath = path.join(__dirname, cacheFolder);

	fs.readdir(cacheFolderPath, (err, files) => {
		if (err) {
			return console.error(`Unable to read directory: ${err.message}`);
		}

		for (const file of files) {
			fs.unlink(path.join(cacheFolderPath, file), err => {
				if (err) {
					console.error(`Unable to delete file: ${err.message}`);
				}
			});
		}
	});
}

//client related functions
export const clientUtils = {
	/**
	 * tries to get the server from client cache, else gets it with fetch()
	 * @param guildId
	 * @returns Promise<Guild>
	 */
	findGuild: async function (guildId: string) {
		try {
			console.log(`Searching for ${guildId}`);

			const guild = await client.guilds.cache.get(guildId);
			return guild ? guild : await client.guilds.fetch(guildId);
		} catch (error) {
			console.log(error);
			return undefined;
		}
	},

	/**
	 * takes guild-, channel- and message-id and safely fetches the desired Message
	 * @param guildId
	 * @param channelId
	 * @param messageId
	 * @returns Promise<Message>
	 */
	findMessage: async function (guildId: string, channelId: string, messageId: string) {
		const guild = await clientUtils.findGuild(guildId);
		const channel = await guildUtils.findChannel(guild!, channelId);
		if (!channel) throw new Error(`Could not find channel ${channelId}`);
		if (!channel?.isTextBased()) {
			throw Error(
				`ERROR: Channel is not Text Channel\nMessageId: ${messageId}, ChannelId ${channel?.name}, Guild:${guild!.name}`
			);
		}
		const msg = await channelSafeFetchMessage(channel as TextChannel, messageId);

		//no point of going on if no message is found
		if (!msg) {
			throw Error(
				`ERROR: Message could not be found!\nMessageId: ${messageId}, ChannelId ${channel?.name}, Guild:${guild!.name}`
			);
		}
		return msg;
	},

	/**
	 * tries to get the user from client cache, else gets it with fetch()
	 * @param userId
	 * @returns Promise<User>
	 */
	findUser: function (userId: string) {
		const user = client.users.cache.get(userId);
		return user ? user : client.users.fetch(userId);
	},
};

/**
 * Some general utlity functions for the bot like fetching guilds, channels, etc.
 */

//Guild related functions
export const guildUtils = {
	/**
	 * tries to get the channel from server cache, else gets it with fetch()
	 * @param guild
	 * @param channelId
	 * @returns Promise<CategoryChannel | NewsChannel | StageChannel | StoreChannel | TextChannel | ThreadChannel | VoiceChannel | null>
	 */
	findChannel: async function (guild: Guild, channelId: string) {
		const channel = guild.channels.cache.get(channelId);
		return channel ? channel : guild.channels.fetch(channelId);
	},

	/**
	 * tries to get the server from guild cache, else gets it with fetch()
	 * @param guild
	 *  @param memberId
	 * @returns Promise<GuildMember>
	 */
	findMember: async function (guild: Guild, memberId: string) {
		const member = guild.members.cache.get(memberId);
		return member ? member : guild.members.fetch(memberId);
	},

	/**
	 * Finds the role inside a guild
	 * @param  {Guild} guild
	 * @param  {string} roleId
	 */
	findRole: async function (guild: Guild, roleId: string) {
		const role = guild.roles.cache.get(roleId);
		return role ? role : guild.roles.fetch(roleId);
	},

	/**
	 * Finds the user inside a guild with a given discord tag (username#discriminator)
	 * @param  {string} username
	 * @param guild
	 */
	getMemberFromUsername: async function (username: string, guild: Guild) {
		if(!guild){
			console.error("Guild is undefined");
			return undefined;
		}
		console.log(`Searching for ${username} in ${guild.name}`);
		const users = await guild!.members.fetch({
			query: username.includes("#") ? username.split("#")[0] : username.toString(),
			limit: 1,
		});
		try {
			if (username.includes("#")){
				return users!.find((u) => u.user.discriminator === username.split("#")[1]) ?? undefined;
			} else {
				return users!.first() ?? undefined;
			}
		} catch (error) {
			console.error(error);
			return undefined;
		}
	},
};

/**
 * tries to get any object which supports discord.js fetch() from client cache, else gets it with fetch()
 * E.g. with client.users.fetch(userId)
 * @param fromObj: usually client, guild or channel
 *  @param getThis: String. The name of the interface from with is fetches. ("users" in the example)
 *  @param fetchId: String. The Id ("userId" in the example)
 * @returns Promise<Obj>
 */
export async function anySafeFetchAny(fromObj: any, getThis: string, fetchId: string) {
	const r = fromObj[getThis].cache.get(fetchId);
	return r ? r : fromObj[getThis].fetch(fetchId);
}

/**
 * tries to get the message from channel cache, else gets it with fetch()
 * @param channel
 * @param messageId
 * @returns Promise<Message<boolean> | undefined>
 */
export async function channelSafeFetchMessage(
	channel: TextChannel | null,
	messageId: string
): Promise<Message<boolean> | undefined> {
	const message = channel?.messages.cache.get(messageId);
	return message ? message : channel?.messages.fetch(messageId);
}

/**
 * handles case msg.type === APIMessage
 * @returns
 * @param unknownMsg
 * @param channel
 */
export async function resolveInteractionMessage(
	unknownMsg: any | APIMessage | Message,
	channel: TextChannel
): Promise<Message<boolean>> {
	if (!isMessage(unknownMsg)) {
		console.log("Entered .edit === undefined");
		return channel?.messages.fetch(unknownMsg.id);
	}
	return unknownMsg;
}

/**
 * Checks if of type Message
 * @param msg
 * @returns
 */
export function isMessage(msg: any): msg is Message {
	return msg.editable !== undefined;
}