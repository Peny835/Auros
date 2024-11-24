const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Banuje użytkownika z serwera.',
    devOnly: true,
    testOnly: true,
    options: [
        {
            name: 'użytkownik',
            description: 'Użytkownik, którego chcesz zbanować.',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'powód',
            description: 'Powód zbanowania użytkownika.',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    permissionsRequired: [PermissionsBitField.Flags.Administrator],
    botPermissions: [PermissionsBitField.Flags.Administrator],

    callback: async (client, interaction) => {
        const user = interaction.options.getUser('użytkownik');
        const reason = interaction.options.getString('powód') || 'Brak powodu';

        if (!interaction.guild) {
            return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
        }

        try {
            const member = await interaction.guild.members.fetch(user.id);
            if (!member) {
                return interaction.reply({ content: 'Could not find the specified user in this server.', ephemeral: true });
            }

            await member.ban({ reason });
            interaction.reply({ content: `Zbanowano użytkownika ${user.tag} z powodem: ${reason}` });
        } catch (error) {
            console.error('Error banning user:', error);
            interaction.reply({ content: 'There was an error trying to ban this user.', ephemeral: true });
        }
    }
};