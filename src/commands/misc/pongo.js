const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pongsa')
        .setDescription('Replies wth Pong!')
        .setNSFW(false),
        async execute(interaction) {
            await interaction.reply('Pong!');
        },
}