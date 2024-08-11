const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Rozpocznij proces tworzenia ticketa.'),
    async execute(interaction) {
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('ticket_select')
            .setPlaceholder('🎫 Wybierz opcję, aby otworzyć ticket')
            .addOptions([
                {
                    label: '🛠️ Pomoc Techniczna',
                    description: 'Utwórz ticket dla wsparcia technicznego.',
                    value: 'help',
                },
                {
                    label: '🤝 Współpraca',
                    description: 'Utwórz ticket dla współpracy.',
                    value: 'collaboration',
                },
                {
                    label: '💼 Rekrutacja',
                    description: 'Utwórz ticket dla aplikacji na stanowisko.',
                    value: 'recruitment',
                },
                {
                    label: '📋 Raport',
                    description: 'Utwórz ticket do zgłoszenia błędu lub nadużycia.',
                    value: 'report',
                },
                {
                    label: '❓ Inne',
                    description: 'Utwórz ticket dla innych zapytań.',
                    value: 'other',
                },
            ]);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const embed = new EmbedBuilder()
            .setColor('#4a0b0b')
            .setTitle('HypeHost.pl | System Ticket')
            .setDescription('Wybierz jedną z opcji z poniższego menu, aby utworzyć ticket.\n\n**Dostępne Opcje:**\n\n🛠️ **Pomoc Techniczna**: Potrzebujesz pomocy z problemem technicznym?\n🤝 **Współpraca**: Masz propozycję współpracy?\n💼 **Rekrutacja**: Chcesz dołączyć do naszego zespołu?\n📋 **Raport**: Zgłoś problem lub nadużycie.\n❓ **Inne**: Masz inne pytanie?')
            .setFooter({ text: 'Prosimy o cierpliwość, nasz zespół wkrótce się z Tobą skontaktuje.' })
            .setThumbnail('https://example.com/your-thumbnail.png')
            .setTimestamp();

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};
