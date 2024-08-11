const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Banuje użytkownika z serwera.')
        .addUserOption(option =>
            option
                .setName('użytkownik')
                .setDescription('Użytkownik, którego chcesz zbanować.')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('powód')
                .setDescription('Powód bana.'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const user = interaction.options.getUser('użytkownik');
        const reason = interaction.options.getString('powód') || 'Brak powodu';
        const member = interaction.guild.members.resolve(user);

        if (!member) {
            return interaction.reply({ content: 'Nie mogę znaleźć tego użytkownika na serwerze.', ephemeral: true });
        }

        try {
            await member.ban({ reason });

            const embed = new EmbedBuilder()
                .setColor('#4a0b0b')
                .setTitle('🔨 Użytkownik zbanowany')
                .addFields(
                    { name: 'Użytkownik', value: `${user.tag}`, inline: true },
                    { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
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
                await interaction.reply({ content: 'Wystąpił błąd podczas próby zbanowania użytkownika.', ephemeral: true });
            }
        }
    },
};
