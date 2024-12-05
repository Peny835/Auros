const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const currentSong = require("../../../embed/currentSong");
const previousSong = require("../../../functions/trackStart/previousSong");
const { queue, deleteMessage } = require("../../../functions/trackStart/queue");
const { pause, play } = require("../../../functions/trackStart/trackManage");
const util = require('util');


function numberCheck(number) {
    return number >= 1 && number <= 100;
}


module.exports = async (client, interaction) => {
    if (!interaction.isButton()) return;

    const channel = interaction.member.voice.channelId;
    const botVoiceState = interaction.guild.voiceStates.cache.get(client.user.id);

    if (!botVoiceState || botVoiceState.channelId !== channel) {
        return interaction.reply({ content: 'Musisz być na kanale głosowym z botem, aby użyć tych przycisków!', ephemeral: true });
    }

    const player = interaction.client.lavalink.players.get(interaction.guildId);
    if (!player) return interaction.reply({ content: 'Nic nie jest odtwarzane!', ephemeral: true });

    const modal = new ModalBuilder()
        .setCustomId('volumeModal')
        .setTitle('Głośność');
    const volumeInput = new TextInputBuilder()
        .setCustomId('volume')
        .setLabel('Podaj głośność (0-100)')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('np. 50')
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(3);
    const actionRow = new ActionRowBuilder().addComponents(volumeInput);

    switch (interaction.customId) {
        case 'stop':
            interaction.deferUpdate();
            player.destroy(`Zatrzymano przez ${interaction.user.tag}`);
            break;
        case 'previous':
            case 'previous':
                await previousSong(client, player, interaction);
                break;
        case 'next':
            embed = new EmbedBuilder()
            .setDescription(`[${player.queue.current.info.title}](${player.queue.current.info.uri})`)
            .setColor(`NotQuiteBlack`)
            .setTitle('Przeskoczono piosenke')
            .setFooter({text: `Przez ${interaction.user.tag}`})
            await interaction.reply({ content: '', embeds : [embed]});
            if (player.queue.length === 0) {
                player.stopPlaying();
            } else {
                player.skip();
            }
            break;
        case 'pause':
            await pause(client, player, interaction);
            break;
        case 'play':
            await play(client, player, interaction);
            break;
        case 'loop':
            if (player.repeatMode === "off") {
                player.setRepeatMode("track");
                const embed1 = new EmbedBuilder()
                    .setDescription(`Pętla ustawiona na: **Piosenke**`)
                    .setFooter({text: `Przez ${interaction.user.tag}`})
                interaction.reply({ content: '', embeds : [embed1]});
                await deleteMessage(client, interaction, player);
                const { embed, actionRow1, actionRow2 } = currentSong(player, player.queue.current);
                const channel = await client.channels.fetch(player.options.textChannelId);
                await channel.send({ embeds: [embed], components: [actionRow1, actionRow2] });
                break;
            }
            if (player.repeatMode === "track") {
                player.setRepeatMode("queue");
                const embed1 = new EmbedBuilder()
                    .setDescription(`Pętla ustawiona na: **Kolejke**`)
                    .setFooter({text: `Przez ${interaction.user.tag}`})
                interaction.reply({ content: '', embeds : [embed1]});
                await deleteMessage(client, interaction, player);
                const { embed, actionRow1, actionRow2 } = currentSong(player, player.queue.current);
                const channel = await client.channels.fetch(player.options.textChannelId);
                await channel.send({ embeds: [embed], components: [actionRow1, actionRow2] });
                break;
            }
            if (player.repeatMode === "queue") {
                player.setRepeatMode("off");
                const embed1 = new EmbedBuilder()
                    .setDescription(`Pętla **wyłączona**`)
                    .setFooter({text: `Przez ${interaction.user.tag}`})
                interaction.reply({ content: '', embeds : [embed1]});
                await deleteMessage(client, interaction, player);
                const { embed, actionRow1, actionRow2 } = currentSong(player, player.queue.current);
                const channel = await client.channels.fetch(player.options.textChannelId);
                await channel.send({ embeds: [embed], components: [actionRow1, actionRow2] });
                break;
            }
            break;
        case 'shuffle':
            if (player.queue.length < 3) {
                return interaction.reply({ content: 'Za mało utworów w kolejce, aby je wymieszać!', ephemeral: true });
            }
            player.queue.shuffle();
            const embed = new EmbedBuilder()
                .setColor(`NotQuiteBlack`)
                .setDescription(`Kolejka została **wymieszana**!`)
                .setFooter({text: `Przez ${interaction.user.tag}`})
            await interaction.reply({ content: '', embeds: [embed] });
            break;
        case 'queue':
        await queue(client, player, interaction)
        break;
        case 'volume':
            modal.addComponents(actionRow);
            await interaction.showModal(modal);
            break;
            case 'lyrics':
                console.log('Lyrics button clicked!');
                //Lyrics TODO
                break;
        default:
            break;
    }
}