import {
	ChatInputCommandInteraction,
	SelectMenuInteraction,
	GuildMember,
	SlashCommandBuilder,
	ActionRowBuilder,
	EmbedBuilder,
	SelectMenuBuilder,
	Locale,
	ChannelType,
} from "discord.js";
import SlashCommand from "../commandTypes/slashCommand";
import helpMessages from "../../../data/helpMessages.json"
import {SelectMenuWrapper} from "../../selectMenuHandler/selectmenu";

export default new SlashCommand({
	//______SLASH COMMAND OPTIONS_________
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Help Command")
		.setDescriptionLocalizations({
			de: "Hilfe Befehl",
		})
		.addStringOption((option) =>
			option.setName("option").setDescription("option for more help pages").setDescriptionLocalizations({
				de: "Option für mehr Hilfeseiten",
			})
		),
	//_________COMMAND____________
	async execute(interaction): Promise<void> {
		const option = interaction.options.getString("option")?.toLowerCase() ?? null;
			await sendHelpPage(option, interaction);
	},
});
async function sendHelpPage(help: string | null, interaction: any) {
	//finds correct help message in json
	let helpOpt = findHelpOpt(help);
	//sends the help message
	if (!helpOpt) {
		await defaultHelpSend(interaction);
	} else {
		//parse help message
		helpOpt = parseHelpMessage(helpOpt as unknown as helpOption);
		//send parsed message
		await interaction.reply(helpOpt.messageOpt);
		console.log("Send Help Message: " + helpOpt.selectOpt.title);
	}
}

function findHelpOpt(help: string | null) {
	let helpOpt: any = undefined;
	helpMessages.forEach((opt) => {
		if (!helpOpt && opt.selectOpt.value === help) {
			helpOpt = opt;
			return;
		}
	});
	return helpOpt;
}

async function defaultHelpSend(interaction: any) {
	const helpSelect = generateSelMenu(interaction) as SelectMenuBuilder;
	console.log(helpSelect);

	const row = new ActionRowBuilder().addComponents(helpSelect);
	const helpEmbed = new EmbedBuilder()
		.setColor("#0099ff")
		.setTitle("ℹ️ Help page of Winny")
		.setThumbnail("https://raw.githubusercontent.com/Kinark/winston/main/winston/Assets.xcassets/AppIcon.appiconset/Frame%207-1024.png")
		.addFields(
			{
				name: "Who am I?",
				value: "Welcome to Winny, your friendly virtual assistant!🌟 I'm here to assist you in managing our theme store and helping out with server-related tasks. Whether you need to upload themes, check theme statuses, or perform server operations, I'm here to streamline the process and make server management a breeze.",
			},

			{
				name: "📋 Available Help commands:",
				value: "To see all the available help command please click the dropdown menu at the bottom of this message. If you want to see more information about one of those things, just select it! Alternative you can write /help <select-menu-option-title>",
			},
			{
				name: "🌐 Useful ressources:",
				value:
					"- Current project updates: <#1124154008764956702>\n- Found a Bug? Report it here: <#1136045746865569962>\n- [Contribution Guide (TODO)](https://github.com/Kinark/winston#winston-for-reddit)",
			},
			{
				name: "❕ Where to find us:",
				value: `- Patreon: https://www.patreon.com/user?u=93745105\n- Ko-fi: https://ko-fi.com/locafe\n- Discord: https://discord.gg/vU8U4DZx\n- GitHub: https://github.com/Kinark/Winston\n- TestFlight: https://testflight.apple.com/join/3UF8bAUN`,
			},
			{
				name: "❔What if I need help?",
				value: "Don't fret to ask! The <#1123388195732721745> channel is always open. Or you can tag one of the people with these roles: <@&1095112007251939348>, <@&1140060935164264448>, <@&1094829533376552991>"
			}
		)
		.setTimestamp()
		.setFooter({ text: "Winny - v" + process.env.npm_package_version, iconURL: "https://cdn.discordapp.com/avatars/1155787817302114346/6e737c3f17d1415f1883b67661c433c0.png?size=160" });

	await interaction.reply({ embeds: [helpEmbed], components: [row], ephemeral: true });
}

function generateSelMenu(interaction: ChatInputCommandInteraction) {
	console.log("Generating select menu...");
	const member = interaction.member as GuildMember;

	//Creates new select menuWrapper
	let selmen = new SelectMenuWrapper(selectMenuHandler).setPlaceholder("Nothing selected").registerSelectMenu(); // register the select menu

	let selmenOptions: Array<any> = [];

	//add each help option in the json to the select menu
	helpMessages.forEach((msg) => {
		selmenOptions.push({
			label: msg.selectOpt.title,
			description: msg.selectOpt.description,
			value: msg.selectOpt.value,
		});
	});
	selmen.addOptions(selmenOptions);
	return selmen;
}

async function selectMenuHandler(interaction: SelectMenuInteraction) {
	//gets value of selected option
	const option = interaction.values[0];
	await sendHelpPage(option, interaction);
}

/**
 * Parses the help message and replaces the placeholders with the correct values
 * @returns the parsed help message
 * ${envVariable} => channel
 * @param helpOption
 */
function parseHelpMessage(helpOption: helpOption) {
	let msg = helpOption.messageOpt.content;

	//PARSE: ${envVariable}----------------
	//regex to find all ${} in string
	const regex = /\${(.*?)}/g;
	const matches = helpOption.messageOpt.content.matchAll(regex);

	//loop through matches
	for (let groups of matches) {
		//get the env variable
		const envVar = process.env[groups[1].toUpperCase()] ?? "Error: No value found";
		//insert channel into msg
		msg = msg.replace(groups[0], "<#" + envVar + ">");
	}
	helpOption.messageOpt.content = msg;
	return helpOption;
}

interface helpOption {
	selectOpt: {
		title: string;
		description: string;
		value: string;
	};
	messageOpt: {
		content: string;
		ephemeral: boolean;
	};
}