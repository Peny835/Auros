const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pongra')
        .setDescription('Replies wt Pon!')
        .setNSFW(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('delass')
                .setDescription('Set ping dela')),
        async execute(interaction) {
            await interaction.reply('Pong!');
        },
};