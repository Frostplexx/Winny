"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents an Application Command
 */
class SlashCommand {
    /**
     *      data: SlashCommandBuilder | ContextMenuCommandBuilder | SlashCommandSubcommandsOnlyBuilder
     *      hasSubCommands?: boolean
     *      execute?: (interaction: ChatInputCommandInteraction) => Promise<void> | void
     *  }} options - The options for the slash command
     * @param options
     */
    constructor(options) {
        var _a;
        if (options.hasSubCommands) {
            this.execute = async (interaction) => {
                const subCommandGroup = interaction.options.getSubcommandGroup();
                const commandName = interaction.options.getSubcommand();
                if (!commandName) {
                    await interaction.reply({
                        content: "I couldn't understand that command!",
                        ephemeral: true,
                    });
                }
                else {
                    try {
                        const command = (await Promise.resolve(`${`../subCommands/${this.data.name}/${subCommandGroup ? `${subCommandGroup}/` : ""}${commandName}.js`}`).then(s => __importStar(require(s)))).default;
                        await command.execute(interaction);
                    }
                    catch (error) {
                        console.error(error);
                        await interaction.reply({
                            content: "An error occured when attempting to execute that command!",
                            ephemeral: true,
                        });
                    }
                }
            };
        }
        else if (options.execute) {
            this.execute = options.execute;
        }
        else {
            throw new Error("No execute function provided");
        }
        this.data = options.data;
        this.hasSubCommands = (_a = options.hasSubCommands) !== null && _a !== void 0 ? _a : false;
    }
}
exports.default = SlashCommand;
