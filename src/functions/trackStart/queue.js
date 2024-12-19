const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const currentSong = require('../../assets/embeds/currentSong');

async function deleteMessage(client, interaction, player) {
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
}

async function deleteMessage2(client, interaction, player) {
    const channel = await client.channels.fetch(player.options.textChannelId);

    const messages = await channel.messages.fetch({ limit: 50 });

    if (!channel) return;

    const lastMessage = messages.find(msg => 
        msg.author.id === client.user.id && 
        msg.embeds.length > 0 && 
        msg.embeds[0].title && msg.embeds[0].title.includes('Kolejka')
    );

    if (lastMessage) {
        await lastMessage.delete();
    }
}

async function queue(client, player, interaction) {

    if (player.queue.length === 0) {
        interaction.reply({ content: 'Kolejka jest pusta!', ephemeral: true });
    } else {
        let currentIndex = 0;
        const tracksPerPage = 10;

        const generateEmbed = (startIndex) => {
            const currentTracks = player.queue.tracks.slice(startIndex, startIndex + tracksPerPage);
            const embed = new EmbedBuilder()
                .setTitle('Kolejka')
                for (const [index, track] of currentTracks.entries()) {
                    embed.addFields({'name': `${startIndex + index + 1}.`, 'value': `[${track.info.title}](${track.info.uri})`});
                }
            return embed;
        };

        if (player.repeatMode === 'track') {
            const embed = new EmbedBuilder()
                .setDescription('Ta piosenka jest w pętli!')
                .setColor(`Red`)
            await interaction.reply({ content: ``, embeds: [embed], ephemeral: true });
            return;
        }
        
        const filter = i => (i.customId === 'nextQueue' || i.customId === 'previousQueue' || i.customId === 'moveTrack') && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'nextQueue') {
                currentIndex += tracksPerPage;
            } else if (i.customId === 'previousQueue') {
                currentIndex -= tracksPerPage;
            } else if (i.customId === 'moveTrack') {
                const modal = new ModalBuilder()
                    .setCustomId('moveTrackModal')
                    .setTitle('Puść piosenke z kolejki')
                    .addComponents(
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('trackNumber')
                                .setLabel('Podaj numer piosenki z kolejki do puszczenia')
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder(`(1-${player.queue.tracks.length})`)
                                .setRequired(true)
                        )
                    );

                await i.showModal(modal);
                return;
            }

            await i.update({
                embeds: [generateEmbed(currentIndex)],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('previousQueue')
                                .setEmoji('1314166134202957834')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentIndex === 0),
                            new ButtonBuilder()
                                .setCustomId('nextQueue')
                                .setEmoji('1314166131862274140')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentIndex + tracksPerPage >= player.queue.tracks.length),
                            new ButtonBuilder()
                                .setCustomId('moveTrack')
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji('1314205309694246942')
                        )
                ]
            });
        });

        interaction.client.on('interactionCreate', async interaction => {
            if (!interaction.isModalSubmit()) return;

            if (interaction.customId === 'moveTrackModal') {
                const trackNumber = parseInt(interaction.fields.getTextInputValue('trackNumber'), 10);
                if (!isNaN(trackNumber) && trackNumber > 0 && trackNumber <= player.queue.tracks.length) {
                    const track = player.queue.tracks.splice(trackNumber - 1, 1)[0];
                    player.queue.tracks.unshift(track);
                    await player.skip();
                    const embed = new EmbedBuilder()
                        .setTitle(`Piosenka ${track.info.title} została przeniesiona na początek kolejki!`)
                        .setColor(`Green`)
                        .setFooter({text: `Przez ${interaction.user.tag}`})
                    await deleteMessage2(client, interaction, player);
                    await interaction.reply({ content: ``, embeds: [embed] });
                } else {
                    await interaction.reply({ content: 'Spróbuj podać inny numer piosenki.', ephemeral: true });
                }
            }
        });
        await deleteMessage(client, interaction, player);
        await interaction.reply({
            embeds: [generateEmbed(currentIndex)],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('previousQueue')
                            .setEmoji('1314166134202957834')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(currentIndex === 0),
                        new ButtonBuilder()
                            .setCustomId('nextQueue')
                            .setEmoji('1314166131862274140')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(currentIndex + tracksPerPage >= player.queue.tracks.length),
                        new ButtonBuilder()
                            .setCustomId('moveTrack')
                            .setEmoji('1314205309694246942')
                            .setStyle(ButtonStyle.Primary)
                    )
            ]
        })
        const channel = await client.channels.fetch(player.options.textChannelId);
        const { embed, actionRow1, actionRow2 } = currentSong(player, player.queue.current);
        channel.send({ embeds: [embed], components: [actionRow1, actionRow2] });
    }
}

module.exports = { deleteMessage, queue };