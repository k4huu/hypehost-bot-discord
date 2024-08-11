const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Usuwa określoną liczbę wiadomości z kanału.')
        .addIntegerOption(option =>
            option
                .setName('ilość')
                .setDescription('Liczba wiadomości do usunięcia (od 1 do 100)')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages), // Wymaga uprawnienia do zarządzania wiadomościami
    async execute(interaction) {
        const amount = interaction.options.getInteger('ilość');

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({ content: 'Nie masz uprawnień do zarządzania wiadomościami!', ephemeral: true });
        }

        if (amount < 1 || amount > 100) {
            return interaction.reply({ content: 'Musisz podać liczbę od 1 do 100!', ephemeral: true });
        }

        try {
            await interaction.channel.bulkDelete(amount, true);
            await interaction.reply({ content: `Pomyślnie usunięto ${amount} wiadomości.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Wystąpił błąd podczas usuwania wiadomości.', ephemeral: true });
        }
    },
};
