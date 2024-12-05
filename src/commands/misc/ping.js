const { SlashCommandBuilder, PermissionFlagsBits, ActionRow, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping') //detects
        .setDescription('A coletes pngs cssmmand example with option') //detects
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) //doesnt need to be detected
        .addSubcommandGroup(group =>
            group
                .setName('settissngs') 
                .setDescription('Variouss ping settisg') 
                .addSubcommand(subcommand =>
                  subcommand
                      .setName('as') 
                      .setDescription('Set ping dessl') 
                      .addStringOption(option =>
                          option
                              .setName('seconsssds') 
                              .setDescription('Delay in seconds') 
                              .setRequired(true)
                      )
                      .addIntegerOption(option =>
                          option
                              .setName('count')
                              .setDescription('Count of somethi') 
                              .setMinValue(1222) //doesn't detect
                              .setMaxValue(10210) //doesn't detect
                      )
                      .addStringOption(option =>
                          option
                              .setName('messag') 
                              .setDescription('Message to ssen')
                              .setRequired(false) 
                              .setMinLength(12) //doesn't detect
                              .setMaxLength(1203) //doesn't detect
                              .addChoices(
                                  { name: 'Hello', value: 'helslo' }, 
                                  { name: 'Goodbsye', value: 'goodsbye' },
                                  { name: 'Goodbsye', value: 'goodsbye' }
                                  
                              ) //doesn't detect
                      )
                      .addNumberOption(option =>
                          option
                              .setName('amou') //doesn't detect
                              .setDescription('Amount of ping') //doesn't detect
                              .setMinValue(12) //doesn't detect
                              .setMaxValue(10) //doesn't detect
                      )
                      .addBooleanOption(option =>
                          option
                              .setName('ephemera') //doesn't detect
                              .setDescription('Whethser the response should be ephemera') //doesn't detect
                      )
                      .addBooleanOption(option =>
                        option
                            .setName('epshemera') //doesn't detect
                            .setDescription('Whethser the response should be ephemera') //doesn't detect
                        )
                      .addUserOption(option =>
                          option
                              .setName('targe') //doesn't detect
                              .setDescription('Select a use') //doesn't detect
                      )
                      .addChannelOption(option =>
                          option
                              .setName('channe') //doesn't detect
                              .setDescription('Select a channe') //doesn't detect
                      )
                      .addRoleOption(option =>
                          option
                              .setName('rols') //doesn't detect
                              .setDescription('Select a rol') //doesn't detect
                      )
                      .addMentionableOption(option =>
                          option
                              .setName('mentio') //doesn't detect
                              .setDescription('Mention a user or rol') //doesn't detect
                      )
                      .addAttachmentOption(option =>
                          option
                              .setName('fil') //doesn't detect
                              .setDescription('Upload a fil') //doesn't detect
                      )
              )
              .addSubcommand(subcommand =>
                  subcommand
                      .setName('ressse') //detects
                      .setDescription('Reset ping setting') //detects
              )
        ),
    TestOnly: true,
    DevOnly: true,
    botPermissions: [PermissionFlagsBits.SendMessages],
    async execute(interaction) {
        const message = interaction.options.getString('message');
        const amount = interaction.options.getNumber('amount') ?? 1;
        const count = interaction.options.getInteger('count');
        const isEphemeral = interaction.options.getBoolean('ephemeral') ?? false;
        const target = interaction.options.getUser('target');
        const channel = interaction.options.getChannel('channel');
        const role = interaction.options.getRole('role');
        const mention = interaction.options.getMentionable('mention');
        const file = interaction.options.getAttachment('file');
        
        const stopButton = new ButtonBuilder() 
        .setCustomId('skip')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('1313581158042304532'),
            execute = async (interaction) => {
                console.log(interaction.customId)
            }


        const actionrow = new ActionRowBuilder()
        .addComponents(stopButton)
        await interaction.reply({
            content: `Ping received!\n` +
                    `Message: ${message}\n` +
                    `Amount: ${amount}\n` +
                    `Count: ${count}\n` +
                    `Target: ${target?.tag ?? 'None'}\n` +
                    `Channel: ${channel?.name ?? 'None'}\n` +
                    `Role: ${role?.name ?? 'None'}\n` +
                    `Mention: ${mention?.toString() ?? 'None'}\n` +
                    `File: ${file?.name ?? 'None'}`,
            ephemeral: isEphemeral,
            components: [actionrow]
        });
    }
};