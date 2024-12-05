const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const msToTime = require('../../utils/msToTime');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Odtwarza muzykę.')
        .addStringOption(option =>
            option.setName('choice')
                .setDescription('Wybierz żródło wyszukiwania')
                .setRequired(true)
                .setChoices([
                    { name: 'YouTube', value: 'ytsearch' },
                    { name: 'YouTube Music', value: 'ytmsearch' },
                    { name: 'Spotify', value: 'spsearch' },
                    { name: 'SoundCloud', value: 'scsearch' },
                ])

        )
        .addStringOption(option =>
            option.setName('song')
                .setDescription('Podaj piosenke którą chcesz puścić')
                .setRequired(true)),
    botPermissions: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],
    async execute(interaction) {
        try {
            const song = interaction.options.getString('song');
            const { channel } = interaction.member.voice;

            if (!channel) {
                return interaction.reply({ content: 'Musisz być na kanale głosowym, aby użyć tej komendy!', ephemeral: true });
            }
            
            if (!channel.joinable) {
                return interaction.reply({ content: 'Nie mogę dołączyć do tego kanału głosowego!', ephemeral: true });
            }
            
            if (!channel.speakable) {
                return interaction.reply({ content: 'Nie mogę mówić na tym kanale głosowym!', ephemeral: true });
            }

            await interaction.reply({ content: `🔍 Wyszukiwanie...` });

            const player = interaction.client.lavalink.getPlayer(interaction.guildId) || await interaction.client.lavalink.createPlayer({
                guildId: interaction.guild.id, 
                voiceChannelId: interaction.member.voice.channelId, 
                textChannelId: interaction.channel.id, 
                selfDeaf: true, 
                selfMute: false,
                volume: 100,  
            });

            const res = await player.search({ query: song, source: interaction.options.getString('choice')}, interaction.user);

            if (!res.tracks.length) {
                return interaction.editReply({ content: 'Nie znaleziono żadnych wyników!' });
            }
            await player.connect()
            if (res.loadType === "playlist") {
                for (let track of res.tracks) {
                    player.queue.add(track);
                }
                if (!player.playing && !player.paused) {
                    player.play();
                }
                
                const embed = new EmbedBuilder()
                    .setColor("#09f633")
                    .setTitle(`**${res.playlist.name}**`)
                    .setDescription(`Dodano playliste do kolejki!`)
                    .setURL(song)
                    .addFields(
                        { name: 'Piosenki:', value: res.tracks.length.toString(), inline: true },
                        { name: 'Długość:', value: msToTime(res.playlist.duration), inline: true }
                    );
                return interaction.editReply({content: '', embeds: [embed] });
            } else {
                player.queue.add(res.tracks[0]);
                if (!player.playing && !player.paused) {
                    player.play();
                }
                const embed = new EmbedBuilder()
                    .setColor('#09f633')
                    .setTitle(`${res.tracks[0].info.title}`)
                    .setURL(res.tracks[0].info.uri)
                    .setDescription(`Dodano do kolejki!`)
                return interaction.editReply({content: '', embeds: [embed] });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({conent: 'Wystąpił błąd!', ephemeral: true});}
    }
}