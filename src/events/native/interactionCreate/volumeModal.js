const { deleteMessage } = require("../../../functions/trackStart/queue");
const currentSong = require("../../../embed/currentSong");

function numberCheck(number) {
    return number >= 1 && number <= 250;
}
module.exports = async (client, interaction) => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'volumeModal') {
        const volume = parseInt(interaction.fields.getTextInputValue('volume'), 10);
        if (numberCheck(volume)) {
            const player = client.lavalink.players.get(interaction.guildId);
            player.setVolume(volume);
            interaction.deferUpdate();
            await deleteMessage(client, interaction, player);
            const channel = await client.channels.fetch(player.options.textChannelId);
            const { embed, actionRow1, actionRow2 } = currentSong(player, player.queue.current);
            await channel.send({ embeds: [embed], components: [actionRow1, actionRow2] });
        } else {
            await interaction.reply({ content: 'Podaj liczbę z zakresu 1-250.', ephemeral: true });
        }
    }
}