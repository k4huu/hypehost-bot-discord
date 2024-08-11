const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../../config.json');

const warnings = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Ostrzega użytkownika.')
        .addUserOption(option =>
            option
                .setName('użytkownik')
                .setDescription('Użytkownik, którego chcesz ostrzec.')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('powód')
                .setDescription('Powód ostrzeżenia.'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const user = interaction.options.getUser('użytkownik');
        const reason = interaction.options.getString('powód') || 'Brak powodu';
        const member = interaction.guild.members.resolve(user);

        if (!member) {
            return interaction.reply({ content: 'Nie mogę znaleźć tego użytkownika na serwerze.', ephemeral: true });
        }

        const userWarnings = warnings.get(user.id) || 0;
        warnings.set(user.id, userWarnings + 1);

        const embed = new EmbedBuilder()
            .setColor('#4a0b0b')
            .setTitle('⚠️ Otrzymałeś ostrzeżenie')
            .addFields(
                { name: 'Serwer', value: interaction.guild.name, inline: true },
                { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
                { name: 'Powód', value: reason, inline: true },
                { name: 'Liczba ostrzeżeń', value: `${warnings.get(user.id)} z 3`, inline: true }
            )
            .setTimestamp();

        try {
            await user.send({ embeds: [embed] });
        } catch (error) {
            console.error(`Nie udało się wysłać wiadomości do użytkownika ${user.tag}.`);
        }

        const logEmbed = new EmbedBuilder()
            .setColor('#4a0b0b')
            .setTitle('⚠️ Użytkownik otrzymał ostrzeżenie')
            .addFields(
                { name: 'Użytkownik', value: `${user.tag}`, inline: true },
                { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
                { name: 'Powód', value: reason, inline: true },
                { name: 'Liczba ostrzeżeń', value: `${warnings.get(user.id)} z 3`, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [logEmbed], ephemeral: true });

        const logChannel = interaction.guild.channels.cache.get(config.logChannelId);
        if (logChannel) {
            await logChannel.send({ embeds: [logEmbed] });
        }

        if (warnings.get(user.id) >= 3) {
            try {
                await member.kick('Osiągnięto 3 ostrzeżenia');
                const kickEmbed = new EmbedBuilder()
                    .setColor('#4a0b0b')
                    .setTitle('👢 Użytkownik wyrzucony po 3 ostrzeżeniach')
                    .addFields(
                        { name: 'Użytkownik', value: `${user.tag}`, inline: true },
                        { name: 'Moderator', value: `${interaction.user.tag}`, inline: true }
                    )
                    .setTimestamp();

                await interaction.followUp({ embeds: [kickEmbed], ephemeral: true });

                if (logChannel) {
                    await logChannel.send({ embeds: [kickEmbed] });
                }

                warnings.delete(user.id);
            } catch (error) {
                console.error(error);
                if (!interaction.replied) {
                    await interaction.reply({ content: 'Wystąpił błąd podczas próby wyrzucenia użytkownika.', ephemeral: true });
                }
            }
        }
    },
};
