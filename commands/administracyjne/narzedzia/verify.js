const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weryfikacja')
        .setDescription('Wysyła wiadomość weryfikacyjną.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: 'Nie masz uprawnień do używania tej komendy!', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor('#4a0b0b')
            .setTitle('💠 HypeHost.pl | Weryfikacja')
            .setDescription(
                '**Witaj na naszym serwerze!**\n\n' +
                'Aby uzyskać dostęp do wszystkich kanałów i funkcji, musisz przejść proces weryfikacji. ' +
                'Jest to szybki test, który potwierdzi, że jesteś prawdziwym użytkownikiem.\n\n' +
                '**Co należy zrobić?**\n' +
                '1. Kliknij przycisk "Weryfikacja" poniżej.\n' +
                '2. Odpowiedz poprawnie na proste pytanie matematyczne.\n' +
                '3. Otrzymasz dostęp do serwera!\n\n' +
                '**Dlaczego musimy to robić?**\n' +
                'Weryfikacja pomaga nam zapobiegać spamowi i chronić naszą społeczność przed niechcianymi użytkownikami.'
            )
            .addFields(
                { name: '🔒 Bezpieczeństwo', value: 'Twoje dane są bezpieczne. Proces weryfikacji nie wymaga podania żadnych prywatnych informacji.' },
                { name: '📜 Zasady', value: 'Pamiętaj, że po uzyskaniu dostępu do serwera, musisz przestrzegać naszych zasad, które znajdziesz w regulaminie.' },
                { name: '🆘 Pomoc', value: 'Jeśli napotkasz jakiekolwiek problemy, skontaktuj się z administratorem serwera.' }
            )
            .setThumbnail('https://i.imgur.com/AfFp7pu.png')
            .setImage('https://i.imgur.com/AfFp7pu.png')
            .setFooter({ text: 'DreamCode Verification', iconURL: 'https://i.imgur.com/AfFp7pu.png' })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('verify_button')
                    .setLabel('Weryfikacja')
                    .setStyle(ButtonStyle.Secondary) 
            );

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};
