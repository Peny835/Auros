const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getallusers')
        .setDescription('Get all users in the server')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to filter by')
                .setRequired(false)
        ),
    async execute(interaction) {
        let userList = [];
        const role = interaction.options.getRole('role');
        const members = await interaction.guild.members.fetch();
        const users = role ? members.filter(member => member.roles.cache.has(role.id)) : members;
        for (const user of users.values()) {
            userList.push(user.user.username);
    }
    await interaction.reply(`\`\`\`${userList.join('\n')}\`\`\``);
    }
}