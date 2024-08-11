const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Odcisza użytkownika na serwerze.')
        .addUserOption(option =>
            option
                .setName('użytkownik')
                .setDescription('Użytkownik, którego chcesz odciszyć.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
    async execute(interaction) {
        const user = interaction.options.getUser('użytkownik');
        const member = interaction.guild.members.resolve(user);

        if (!member) {
            return interaction.reply({ content: 'Nie mogę znaleźć tego użytkownika na serwerze.', ephemeral: true });
        }

        try {
            await member.timeout(null);

            const embed = new EmbedBuilder()
                .setColor('#4a0b0b')
                .setTitle('🔊 Użytkownik odciszony')
                .addFields(
                    { name: 'Użytkownik', value: `${user.tag}`, inline: true },
                    { name: 'Moderator', value: `${interaction.user.tag}`, inline: true }
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
                await interaction.reply({ content: 'Wystąpił błąd podczas próby odciszenia użytkownika.', ephemeral: true });
            }
        }
    },
};
