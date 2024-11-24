const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping') // Main command
    .setDescription('Ping command with a subcommand') // Main command description
    .addSubcommand(subcommand =>
      subcommand
        .setName('boop')
        .setDescription('Boop! Responds with "Boop!"')
        .addMentionableOption(option =>
          option
            .setName('input')
            .setDescription('The input to echo back')
            .setRequired(true)
        ))
    .addSubcommand(sub =>
      sub
        .setName('boep')
        .setDescription('Boop! Responds with "Boop!"')
    ),
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
    TestOnly: true,
    async execute(interaction) {
		await interaction.reply('Pong!');
}};
