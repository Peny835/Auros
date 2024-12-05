const util = require('util');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, InteractionCollector } = require('discord.js');
const currentSong = require("../../embed/currentSong");

module.exports = async (client, player, track) => {

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

    const { embed, actionRow1, actionRow2 } = currentSong(player, track);

    channel.send({ embeds: [embed], components: [actionRow1, actionRow2] });
}
