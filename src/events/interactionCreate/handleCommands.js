const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const localCommands = getLocalCommands();

  try {
    const commandObject = localCommands.find(
      (cmd) => cmd.data.name === interaction.commandName
    );

    if (!commandObject) return;

    if (commandObject.data.devOnly) {
      if (!devs.includes(interaction.member.id)) {
        interaction.reply({
          content: 'Nie możesz tego użyć. (DevOnly)',
          ephemeral: true,
        });
        return;
      }
    }

    if (commandObject.data.testOnly) {
      if (!(interaction.guild.id === testServer)) {
        interaction.reply({
          content: 'Nie możesz użyć tego tutaj. (TestServerOnly)',
          ephemeral: true,
        });
        return;
      }
    }

    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          interaction.reply({
            content: 'Nie posiadasz wystarczających uprawnień.',
            ephemeral: true,
          });
          return;
        }
      }
    }

    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = interaction.guild.members.me;

        if (!bot.permissions.has(permission)) {
          interaction.reply({
            content: "Bot nie posiada wystarczających uprawnień.",
            ephemeral: true,
          });
          return;
        }
      }
    }
    await commandObject.execute(interaction, client);

  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true
    })
  }
}
