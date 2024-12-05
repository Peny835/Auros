const { EmbedBuilder } = require('discord.js');

module.exports = async (client, player, interaction) => {
    if (player.queue.previous.length === 0) {
        return interaction.reply({ content: 'Nie ma żadnych poprzednich utworów!', ephemeral: true });
    }
    const previousTrack = player.queue.previous.pop();
    console.log(previousTrack);
    await player.queue.tracks.unshift(previousTrack);
    await player.skip();
    const embed = new EmbedBuilder()
        .setTitle('Dodano poprzedni utwór do kolejki')
        .setDescription(`[${previousTrack.info.title}](${previousTrack.info.uri})`)
        .setColor('NotQuiteBlack')
        .setFooter({ text: `Przez ${interaction.user.tag}` });
    await interaction.reply({ content: '', embeds: [embed]})

}