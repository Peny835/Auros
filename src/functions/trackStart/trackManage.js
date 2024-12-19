const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const currentSong = require('../../assets/embeds/currentSong');
const { deleteMessage } = require('../../functions/trackStart/queue');

async function pause(client, player, interaction) {
    const embed1 = new EmbedBuilder()
    .setDescription(`Wstrzymano odtwarzanie`)
    .setFooter({text: `Przez ${interaction.user.tag}`})
    interaction.reply({ content: '', embeds : [embed1]});
    player.pause(true);
    await deleteMessage(client, interaction, player);
    const { embed, actionRow1, actionRow2, previousButton, pauseButton, stopButton, playbutton, nextButton } = currentSong(player, player.queue.current);
    const pauseButton1 = new ButtonBuilder()
    .setCustomId('pause')
    .setStyle(ButtonStyle.Secondary)
    .setEmoji('1313581149620011060')
    .setDisabled(true);
    const playbutton1 = new ButtonBuilder()
    .setCustomId('play')
    .setStyle(ButtonStyle.Secondary)
    .setEmoji('1313581151247663134')
    .setDisabled(false);
    const actionRow3 = new ActionRowBuilder().addComponents([previousButton, pauseButton1, stopButton, playbutton1, nextButton]);
    const channel = await client.channels.fetch(player.options.textChannelId);
    await channel.send({ embeds: [embed], components: [actionRow3, actionRow2] });
}

async function play(client, player, interaction) {
    const embed2 = new EmbedBuilder()
    .setDescription(`Wznowiono odtwarzanie`)
    .setFooter({text: `Przez ${interaction.user.tag}`})
    interaction.reply({ content: '', embeds : [embed2]});
    player.resume();
    await deleteMessage(client, interaction, player);
    const { embed, actionRow1, actionRow2 } = currentSong(player, player.queue.current);
    const channel = await client.channels.fetch(player.options.textChannelId);
    await channel.send({ embeds: [embed], components: [actionRow1, actionRow2] });
}

module.exports = { pause, play };