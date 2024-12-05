const { EmbedBuilder } = require('discord.js');

module.exports = async (client, player, reason) => {
    const channel = await client.channels.fetch(player.options.textChannelId);

    const messages = await channel.messages.fetch({ limit: 50 });

    if (!channel) return;

    const lastNowPlayingMessage = messages.find(msg => 
        msg.author.id === client.user.id && 
        msg.embeds.length > 0 && 
        msg.embeds[0].title && msg.embeds[0].title.includes('Teraz odtwarzam:')
    );

    if (lastNowPlayingMessage) {
        await lastNowPlayingMessage.delete();
    }

    const embed = new EmbedBuilder()
        .setColor('NotQuiteBlack')
        .setTitle('Zakończono odtwarzanie')
        .setDescription(`${reason}`)
        .setTimestamp();
    channel.send({ embeds: [embed] });
}