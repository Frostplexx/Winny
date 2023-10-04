import {ChannelType, ForumChannel, SlashCommandBuilder} from 'discord.js'
import SlashCommand from "../commandTypes/slashCommand";

export default new SlashCommand({
	//______SLASH COMMAND OPTIONS_________
	data: new SlashCommandBuilder()
		.setName('migrate-posts')
		.setDescription('migrate posts')
		.addStringOption( o =>
		o
			.setDescription("channel id of the forum channel")
			.setName("channel-id")
			.setRequired(true)
		),
	//_________COMMAND____________
	async execute(interaction): Promise<void> {
		const channelId = interaction.options.getString("channel-id")
		if(!channelId) {
			await interaction.reply({content: "Missing Channel Id", ephemeral: true})
			return
		}

		const guild = interaction.guild
		if(!guild){
			await interaction.reply({content: "Not a guild", ephemeral: true})
			return
		}
		const channel = await  guild.channels.fetch(channelId)
		if(!channel){
			await interaction.reply({content: "Not a channel", ephemeral: true})
			return
		}
		if(channel.type != ChannelType.GuildForum){
			await interaction.reply({content: "Not a forum channel", ephemeral: true})
		}

		(channel as ForumChannel).threads.fetchActive().then(threads => {
			threads.threads.forEach(async thread => {
				console.log(thread.name)
				// Fetch all messages in thread
				const messages = await thread.fetchStarterMessage()
				console.log(messages)
			})
		})

	},
})
