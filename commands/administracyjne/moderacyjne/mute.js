const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Wycisza użytkownika na serwerze.')
        .addUserOption(option =>
            option
                .setName('użytkownik')
                .setDescription('Użytkownik, którego chcesz wyciszyć.')
                .setRequired(true))
        .addIntegerOption(option =>
            option
                .setName('czas')
                .setDescription('Czas wyciszenia w minutach.'))
        .addStringOption(option =>
            option
                .setName('powód')
                .setDescription('Powód wyciszenia.'))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
    async execute(interaction) {
        const user = interaction.options.getUser('użytkownik');
        const time = interaction.options.getInteger('czas');
        const reason = interaction.options.getString('powód') || 'Brak powodu';
        const member = interaction.guild.members.resolve(user);

        if (!member) {
            return interaction.reply({ content: 'Nie mogę znaleźć tego użytkownika na serwerze.', ephemeral: true });
        }

        try {
            await member.timeout(time * 60 * 1000, reason);

            const embed = new EmbedBuilder()
                .setColor('#4a0b0b')
                .setTitle('🔇 Użytkownik wyciszony')
                .addFields(
                    { name: 'Użytkownik', value: `${user.tag}`, inline: true },
                    { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Czas wyciszenia', value: `${time || 'Bezterminowe'} minut`, inline: true },
                    { name: 'Powód', value: reason, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

            const logChannel = interaction.guild.channels.cache.get(config.logChannelId);
            if (logChannel) {
                await logChannel.send({ embeds: [embed] });
            }
        } catch (error) {
            console.error(error);
            if (!interaction.replied) {
                await interaction.reply({ content: 'Wystąpił błąd podczas próby wyciszenia użytkownika.', ephemeral: true });
            }
        }
    },
};
