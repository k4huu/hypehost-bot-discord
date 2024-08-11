const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Wystąpił błąd podczas wykonywania tej komendy!', ephemeral: true });
            }
        }

        if (interaction.isButton() && interaction.customId === 'verify_button') {
            const num1 = Math.floor(Math.random() * 10) + 1;
            const num2 = Math.floor(Math.random() * 10) + 1;
            const correctAnswer = num1 + num2;

            const modal = new ModalBuilder()
                .setCustomId('verification_modal')
                .setTitle('Weryfikacja');

            const mathProblem = new TextInputBuilder()
                .setCustomId('math_problem')
                .setLabel(`Ile to jest ${num1} + ${num2}?`)
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const firstActionRow = new ActionRowBuilder().addComponents(mathProblem);
            modal.addComponents(firstActionRow);

            await interaction.showModal(modal);

            client.correctAnswers = client.correctAnswers || {};
            client.correctAnswers[interaction.user.id] = correctAnswer;
        }

        if (interaction.isModalSubmit() && interaction.customId === 'verification_modal') {
            const answer = interaction.fields.getTextInputValue('math_problem');
            const correctAnswer = client.correctAnswers ? client.correctAnswers[interaction.user.id] : null;

            if (parseInt(answer) === correctAnswer) {
                const role = interaction.guild.roles.cache.get(config.verificationRoleId);
                if (role) {
                    await interaction.member.roles.add(role);
                    await interaction.reply({ content: 'Pomyślnie zweryfikowano! Przyznano rolę.', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'Wystąpił błąd: Nie można znaleźć roli weryfikacyjnej.', ephemeral: true });
                }
            } else {
                await interaction.reply({ content: 'Niestety, podałeś złą odpowiedź. Spróbuj ponownie.', ephemeral: true });
            }

            if (client.correctAnswers) {
                delete client.correctAnswers[interaction.user.id];
            }
        }
    },
};
