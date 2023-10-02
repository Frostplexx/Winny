import {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder} from 'discord.js';
import SlashCommand from "../commandTypes/slashCommand";
import {
	getAppVersionAndBuildNumber, getJoinable, getWhatToTest,
} from "../../../features/webHandler/appstoreConnect";

export default new SlashCommand({
	data: new SlashCommandBuilder()
		.setName('testflight')
		.setDescription('See the current TestFlight status'),

	async execute(interaction): Promise<void> {
		await interaction.deferReply()
		const versionNumber = await getAppVersionAndBuildNumber()
		const members = await getJoinable()
		const changelog = await getWhatToTest()
		const testFlightAvailable = members != null && members < 10000

		const button = new ButtonBuilder()
			.setLabel("Join Now!")
			.setStyle(ButtonStyle.Link)
			.setEmoji("<:7361_testflight:1157611311178453032>")
			.setURL("https://testflight.apple.com/join/3UF8bAUN")

		const row = new ActionRowBuilder()
			.setComponents(button)
		const embed = () => {
			return [
				new EmbedBuilder()
					.setThumbnail("https://raw.githubusercontent.com/Frostplexx/Winny/main/src/assets/testflight.jpg")
					.setTitle("TestFlight Info for Winny v" + versionNumber)
					.setDescription(`### Status\n\n${getEmoji(testFlightAvailable)}\n\n----- ${members.toLocaleString('en-US')		}/10,000 Testers -----\n### What to Test\n${changelog}`)
					.setColor("#158AE3")
					.setFooter({ text: "Winny - v" + process.env.npm_package_version, iconURL: "https://cdn.discordapp.com/avatars/1155787817302114346/6e737c3f17d1415f1883b67661c433c0.png?size=160" })
			]
		}
		await interaction.editReply({embeds: embed(), components: testFlightAvailable ? [row as any ] : []})
	},
});

function getEmoji(available: boolean){
	if (available) {
		return "<:0_yes:1157608710395412560><:1_yes:1157608712664526949><:2_yes:1157608714078011412><:3_yes:1157608715487281172><:4_yes:1157608717429260308><:5_yes:1157608718633013278><:6_yes:1157608719891308687><:7_yes:1157608722164625498>"
	}
	return "<:0_no:1157606036971208754><:1_no:1157606038451781662><:2_no:1157606040192434270><:3_no:1157606042063085699>"
}
