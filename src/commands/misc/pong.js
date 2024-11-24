const { SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('pong')
		.setDescription('Replies with Pong!'),
		DevOnly: true,
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};