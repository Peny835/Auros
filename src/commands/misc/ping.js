const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { execute } = require('./pong');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping') 
    .setDescription('Ping command with a subcommand') 
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) 
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
  
    async execute(interaction) {
      await interaction.reply('Pong!');
    },
};