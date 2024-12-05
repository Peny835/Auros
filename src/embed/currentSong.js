const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');
const msToTime = require('../utils/msToTime');

function currentSong(player, track) {
const searchPlatform = track.info.sourceName;
let platformEmoji = '';

switch (searchPlatform) {
    case 'youtube':
    case 'youtubemusic':
        platformEmoji = '<:youtube:1313261345298317343>';
        break;
    case 'soundcloud':
        platformEmoji = '<:soundcloud:1313541933255102464>';
        break;
    case 'spotify':
        platformEmoji = '<:spotify:1313541934899396739>'; 
        break;
    default:
        platformEmoji = '';
}

const stopButton = new ButtonBuilder()
    .setCustomId('stop')
    .setStyle(ButtonStyle.Secondary)
    .setEmoji('1313581158042304532');
const previousButton = new ButtonBuilder()
    .setCustomId('previous')
    .setStyle(ButtonStyle.Secondary)
    .setEmoji('1313581153063800832');
const nextButton = new ButtonBuilder()
    .setCustomId('next')
    .setStyle(ButtonStyle.Secondary)
    .setEmoji('1313581156716773406');
const pauseButton = new ButtonBuilder()
    .setCustomId('pause')
    .setStyle(ButtonStyle.Secondary)
    .setEmoji('1313581149620011060')
    .setDisabled(false);
const playbutton = new ButtonBuilder()
    .setCustomId('play')
    .setStyle(ButtonStyle.Secondary)
    .setEmoji('1313581151247663134')
    .setDisabled(true);
const loopButton = new ButtonBuilder()
    .setCustomId('loop')
    .setStyle(ButtonStyle.Secondary)
    .setEmoji('1313585443924611182')
const shuffleButton = new ButtonBuilder()
    .setCustomId('shuffle')
    .setStyle(ButtonStyle.Secondary)
    .setEmoji('1313581155030929499')
const queueButton = new ButtonBuilder()
    .setCustomId('queue')
    .setStyle(ButtonStyle.Secondary)
    .setEmoji('1313592069452992552')
const volumeButton = new ButtonBuilder()
    .setCustomId('volume')
    .setStyle(ButtonStyle.Secondary)
    .setEmoji('1313592565219590144')
const lyricsButton = new ButtonBuilder()
    .setCustomId('lyrics')
    .setStyle(ButtonStyle.Secondary)
    .setEmoji('1313593350951145472')
    .setDisabled(true)

    const repeat = player.repeatMode === 'off' ? "" :
    player.repeatMode === 'track' ? "**Pętla**: Piosenka" :
    player.repeatMode === 'queue' ? "**Pętla**: Kolejka" : "Unknown";

    const paused = player.paused ? "(Wstrzymany  <:pauseButton:1313581149620011060>  )" : "";
const actionRow1 = new ActionRowBuilder().addComponents([previousButton, pauseButton, stopButton, playbutton, nextButton]);
const actionRow2 = new ActionRowBuilder().addComponents([loopButton, queueButton, volumeButton, lyricsButton, shuffleButton]);
const avatar = `https://cdn.discordapp.com/avatars/${track.userData.requester.id}/${track.userData.requester.avatar}.png?size=2048`
const embed = new EmbedBuilder()
    .setTitle(`${platformEmoji}  **Teraz odtwarzam:**  ${paused}`)
    .setDescription(`[${track.info.title}](${track.info.uri})`)
    .setColor('Random')
    .setThumbnail(track.info.artworkUrl)
    .addFields([
        { name: 'Info', value: `**Głośność:** ${player.volume}%\n${repeat}`},
        { name: 'Autor', value: track.info.author, inline: true },
        { name: 'Długość', value: msToTime(track.info.duration), inline: true }
    ])
    .setFooter({text: `🎵 Puszczone przez: ${track.userData.requester.username} | ${new Date().toLocaleTimeString()}`, iconURL: avatar})

    return { embed, actionRow1, actionRow2, previousButton, pauseButton, stopButton, playbutton, nextButton }
}


module.exports = currentSong;