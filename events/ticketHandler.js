const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits, ChannelType, AttachmentBuilder } = require('discord.js');
const config = require('../config.json');
const { generateFromMessages } = require('discord-html-transcripts');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_select') {
            const option = interaction.values[0];
            const user = interaction.user;
            let channelName = `ticket-${user.username}`;
            let ticketTopic = '';

            switch (option) {
                case 'help':
                    channelName += '-pomoc';
                    ticketTopic = 'Pomoc techniczna';
                    break;
                case 'collaboration':
                    channelName += '-współpraca';
                    ticketTopic = 'Współpraca';
                    break;
                case 'recruitment':
                    channelName += '-rekrutacja';
                    ticketTopic = 'Rekrutacja';
                    break;
                case 'report':
                    channelName += '-raport';
                    ticketTopic = 'Raportowanie';
                    break;
                case 'other':
                    channelName += '-inne';
                    ticketTopic = 'Inne zapytania';
                    break;
            }

            const channel = await interaction.guild.channels.create({
                name: channelName,
                type: ChannelType.GuildText,
                topic: `Ticket created by ${user.id} - ${ticketTopic}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: config.ticketRoleId,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                    },
                    {
                        id: user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                    },
                ],
            });

            const embed = new EmbedBuilder()
                .setColor('#4a0b0b')
                .setTitle(`🎫 Ticket - ${ticketTopic}`)
                .setDescription('Dziękujemy za otwarcie ticketa. Opisz swój problem, a nasz zespół wkrótce się z Tobą skontaktuje.')
                .setTimestamp();

            const closeButton = new ButtonBuilder()
                .setCustomId('close_ticket')
                .setLabel('Zamknij Ticket')
                .setStyle(ButtonStyle.Danger);

            const row = new ActionRowBuilder().addComponents(closeButton);

            await channel.send({ embeds: [embed], components: [row] });
            await interaction.reply({ content: `Twój ticket został utworzony: ${channel}`, ephemeral: true });
        }

        if (interaction.isButton() && (interaction.customId === 'close_ticket' || interaction.customId === 'delete_ticket' || interaction.customId === 'reopen_ticket')) {
            const channel = interaction.channel;
            const match = channel.topic.match(/Ticket created by (\d+)/);

            if (!match) {
                await interaction.reply({ content: 'Nie udało się znaleźć identyfikatora użytkownika w temacie kanału.', ephemeral: true });
                return;
            }

            const userId = match[1];
            const user = await client.users.fetch(userId);

            if (interaction.customId === 'close_ticket') {
                await channel.permissionOverwrites.edit(userId, {
                    ViewChannel: false,
                    SendMessages: false,
                    ReadMessageHistory: false,
                });

                await interaction.reply({ content: 'Ticket został zamknięty.', ephemeral: true });

                const deleteButton = new ButtonBuilder()
                    .setCustomId('delete_ticket')
                    .setLabel('Usuń Ticket')
                    .setStyle(ButtonStyle.Danger);

                const reopenButton = new ButtonBuilder()
                    .setCustomId('reopen_ticket')
                    .setLabel('Przywróć Ticket')
                    .setStyle(ButtonStyle.Primary);

                const adminRow = new ActionRowBuilder().addComponents(reopenButton, deleteButton);

                await channel.send({ content: 'Ticket został zamknięty.', components: [adminRow] });
            }

            if (interaction.customId === 'delete_ticket') {
                if (!interaction.member.roles.cache.has(config.ticketRoleId)) {
                    await interaction.reply({ content: 'Nie masz uprawnień do wykonania tej akcji.', ephemeral: true });
                    return;
                }

                const fetchedMessages = await channel.messages.fetch({ limit: 100 });
                const transcript = await generateFromMessages(fetchedMessages, channel, {
                    returnType: 'buffer',
                    fileName: `${channel.name}-transcript.html`,
                });

                const attachment = new AttachmentBuilder(transcript, { name: `${channel.name}-transcript.html`, contentType: 'text/html' });

                if (user) {
                    await user.send({ content: 'Tutaj jest transcript Twojego usuniętego ticketa.', files: [attachment] });
                }

                const admin = interaction.user;
                await admin.send({ content: 'Tutaj jest transcript usuniętego ticketa.', files: [attachment] });

                await channel.delete();
            }

            if (interaction.customId === 'reopen_ticket') {
                await channel.permissionOverwrites.edit(userId, {
                    ViewChannel: true,
                    SendMessages: true,
                    ReadMessageHistory: true,
                });

                await interaction.reply({ content: 'Ticket został przywrócony.', ephemeral: true });
            }
        }
    },
};
