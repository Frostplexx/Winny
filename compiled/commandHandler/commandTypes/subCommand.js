"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents a SubCommand
 */
class SubCommand {
    /**
     *
     * @param {{
     *      execute: Function
     *  }} options - The options for the subcommand
     */
    constructor(options) {
        this.execute = options.execute;
    }
    /**
     * @param {(interaction: ChatInputCommandInteraction) => Promise<void> | void} executeFunction - The function
     */
    setExecute(executeFunction) {
        this.execute = executeFunction;
    }
}
exports.default = SubCommand;
