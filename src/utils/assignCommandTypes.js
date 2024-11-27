const { SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } = require('discord.js');

function assignCommandTypes(commands) {
    commands.forEach(command => {
        if (command.data.options) {
            command.data.options.forEach(option => {
                if (option instanceof SlashCommandSubcommandGroupBuilder) {
                    option.type = 2; // Subcommand group
                    option.options.forEach(subOption => {
                        if (subOption instanceof SlashCommandSubcommandBuilder) {
                            subOption.type = 1; // Subcommand
                        }
                    });
                } else if (option instanceof SlashCommandSubcommandBuilder) {
                    option.type = 1; // Subcommand
                }
            });
        }
    });
}

module.exports = (commands) => {
    assignCommandTypes(commands);
}