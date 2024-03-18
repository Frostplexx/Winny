import { ActionRowBuilder, CacheType, CommandInteraction, EmbedBuilder, ModalSubmitInteraction, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'
import SlashCommand from "../commandTypes/slashCommand";
import { ModalWrapper } from '../../modalHandler/modal';


let duration = 60000

export default new SlashCommand({
    //______SLASH COMMAND OPTIONS_________
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Poll command')
        .addSubcommand((subcommand) =>
            subcommand
                .setName("create")
                .setDescription("Create a poll")
                .addNumberOption(option =>
                    option
                        .setName("duration")
                        .setDescription("Duration of the poll in minutes")
                )),
    //_________COMMAND____________
    async execute(interaction): Promise<void> {
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case "create":
                pollCreate(interaction)
                break
            default:
                await interaction.reply("No Subcommand found")
                break
        }
    },
})



async function pollCreate(interaction: any) {
    const dur = interaction.options.getNumber("duration")
    if (dur) {
        duration = dur * 60000
    }
    const row1 = new ActionRowBuilder()
        .addComponents(
            [
                new TextInputBuilder()
                    .setCustomId("polltitle")
                    .setLabel("Poll Title")
                    .setPlaceholder("Title of the Poll")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short),

            ]
        )
    const row2 = new ActionRowBuilder()
        .addComponents([
            new TextInputBuilder()
                .setCustomId("pollbody")
                .setPlaceholder("This is a poll example.\n-[p] Poll option 1\n-[p] Poll option 2\n-[p] Poll option\n\n Please select one")
                .setLabel("Poll Body")
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph),

        ])
    const modal = new ModalWrapper(createPoll)
        .setTitle("Create new Poll")
        .setComponents([row1, row2] as any)
    await interaction.showModal(modal)
}

// Function to handle poll creation
async function createPoll(interaction: ModalSubmitInteraction) {
    const title = interaction.fields.getTextInputValue("polltitle")
    const body = interaction.fields.getTextInputValue("pollbody")

    // Set an array of emojis to use as reactions which is the whole alphabet
    const reactionEmojis = [
        "🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯",
        "🇰", "🇱", "🇲", "🇳", "🇴", "🇵", "🇶", "🇷", "🇸", "🇹",
        "🇺", "🇻", "🇼", "🇽", "🇾", "🇿"
    ]

    // Extract all the poll options. They are prefixed with -[p]
    const options = body.match(/-\[p\] (.*)/g)

    const pollOptions: PollOption[] = []

    // Replace the -[p] with the corresponding emoji and add percentages
    let bodyWithEmojis = body

    if (options) {
        options.forEach((option, index) => {
            const percentage = ((index + 1) / options.length) * 100;
            bodyWithEmojis = bodyWithEmojis.replace(option, `${reactionEmojis[index]} (${percentage.toFixed(2)}%) - ${option.replace("-[p] ", "")}`);
            pollOptions.push({ emoji: reactionEmojis[index], option: option.replace("-[p] ", ""), votes: 0 })
        })
    }

    const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle(title)
        .setDescription(bodyWithEmojis)
        .setTimestamp()

    // Create the message with each of the options as reactions
    const message = await interaction.reply({ embeds: [embed], fetchReply: true })
    if (options) {
        options.forEach((_, index) => {
            message.react(reactionEmojis[index])
        })
    }

    // Create reaction collector to collect votes
    const collector = message.createReactionCollector({ time: duration, idle: duration * 2, dispose: true });

    const calulateResults = (reaction: any) => {
        // Calculate total votes
        let totalVotes = 0;
        reaction.message.reactions.cache.forEach((reaction: any) => {
            totalVotes += reaction.count - 1; // Subtract 1 to exclude bot's own reaction
        });

        // Let's make sure duration is positive
        if (duration < 0) {
            duration *= -1
        }

        // Calculate end time
        const startTime = Date.now();
        const endTime = new Date(startTime + duration);
        const endTimeString = endTime.toISOString().slice(0, 19).replace("T", " ");


        // Prepare results
        const results: any = [];
        reaction.message.reactions.cache.forEach((reaction: any) => {
            const percentage = ((reaction.count - 1) / totalVotes) * 100; // Subtract 1 to exclude bot's own reaction
            const foundPollOption = pollOptions.find(option => option.emoji === reaction.emoji.name);
            results.push(`${foundPollOption?.emoji} (${percentage ? 0 : percentage.toFixed(2)}%) - ${foundPollOption?.option}`);
        });

        // Update embed with results
        for (let i = 0; i < results.length; i++) {
            // bodyWithEmojis = bodyWithEmojis.replace(pollOptions[i].emoji, results[i]);
            // regex select the whole line with the emoji and replace it with the new result
            bodyWithEmojis = bodyWithEmojis.replace(new RegExp(`${pollOptions[i].emoji}.*`), results[i]);
        }

        embed.setDescription(bodyWithEmojis);
        embed.setFooter({ text: `Total votes: ${totalVotes} - Ends: ${endTimeString}` });

        // Assuming interaction is defined elsewhere
        interaction.editReply({ embeds: [embed] });
    }

    collector.on("collect", (reaction, _) => {
        calulateResults(reaction);
    });


    collector.on("remove", (reaction, _) => {
        calulateResults(reaction);
    });

    collector.on("dispose", (reaction, _) => {
        calulateResults(reaction);
    });

    collector.on("end", collected => {
        console.log(`Collector ended. Collected ${collected.size} reactions.`);
    });
}


interface PollOption {
    emoji: string;
    option: string;
    votes: number;
}
