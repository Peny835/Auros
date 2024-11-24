const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');
const { PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const localCommands = getLocalCommands();

  try {
    const commandObject = localCommands.find(
      (cmd) => cmd.data.name === interaction.commandName
    );

    if (!commandObject) return;
    if (commandObject.data.default_member_permissions) {
      const permissionNumber = commandObject.data.default_member_permissions;
      const permissions = new PermissionsBitField(permissionNumber);
      const readablePermissions = permissions.toArray().map(permission => {
      return permission.charAt(0).toUpperCase() + permission.slice(1).toLowerCase().replace(/_/g, ' ');
      });
      const member = await interaction.guild.members.fetch(interaction.user.id);
      if (!member.permissions.has(commandObject.data.default_member_permissions)) {
        return await interaction.reply({
          content: `Nie posiadasz wystarczających permisji do użycia tej komendy! (${readablePermissions})`,
          ephemeral: true
        });
      }
    }
    await commandObject.execute(interaction);

  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true
    })
  }
}
