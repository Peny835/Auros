const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song from a YouTube URL')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('The YouTube URL of the song')
                .setRequired(true)),
    
    async execute(interaction) {
        const url = interaction.options.getString('url');
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({ content: 'You need to be in a voice channel to use this command!', ephemeral: true });
        }

        if (!ytdl.validateURL(url)) {
            return interaction.reply({ content: 'Please provide a valid YouTube URL!', ephemeral: true });
        }

        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            const stream = ytdl(url, {
                filter: 'audioonly',
                quality: 'highestaudio',
                highWaterMark: 1 << 25, // Buffer size
            });
            const resource = createAudioResource(stream);

            const player = createAudioPlayer();
            connection.subscribe(player);

            player.play(resource);

            player.on(AudioPlayerStatus.Playing, () => {
                console.log('Audio player is now playing!');
            });

            player.on('error', error => {
                console.error('Error:', error);
            });

            await interaction.reply({ content: `Now playing: ${url}` });

        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'There was an error trying to play the song!', ephemeral: true });
        }
    },
};