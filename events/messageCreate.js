const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const config = require('../config.json');

const warnings = new Map();

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        const linkRegex = /(https?:\/\/[^\s]+)/g;
        if (linkRegex.test(message.content) && !message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            await message.delete();

            const userId = message.author.id;
            const currentWarnings = warnings.get(userId) || 0;
            const newWarnings = currentWarnings + 1;
            warnings.set(userId, newWarnings);

            if (newWarnings >= 3) {
                await message.guild.members.kick(userId, { reason: 'Otrzymano 3 ostrzeżenia za wysyłanie linków.' });
                await message.channel.send(`${message.author.tag} został wyrzucony za wysyłanie linków pomimo ostrzeżeń.`);
                warnings.delete(userId);
            } else {
                const warningEmbed = new EmbedBuilder()
                    .setColor('#ffcc00')
                    .setTitle('🚫 Linki są zabronione')
                    .setDescription(`Nie możesz wysyłać linków na tym serwerze. To jest Twoje ostrzeżenie ${newWarnings}/3.`)
                    .setFooter({ text: 'Po 3 ostrzeżeniach zostaniesz wyrzucony z serwera.' })
                    .setTimestamp();

                message.channel.send({ embeds: [warningEmbed] }).then(msg => {
                    setTimeout(() => msg.delete(), 5000);
                }).catch(console.error);
            }
            return;
        }

        if (message.channel.id !== config.proposalChannelId || message.author.bot) return;

        let votesYes = 0;
        let votesNo = 0;

        const voters = new Map();

        const calculatePercentage = (votes, totalVotes) => {
            return totalVotes ? Math.round((votes / totalVotes) * 100) : 0;
        };

        const updateButtons = () => {
            const totalVotes = votesYes + votesNo;
            const yesPercent = calculatePercentage(votesYes, totalVotes);
            const noPercent = calculatePercentage(votesNo, totalVotes);

            const updatedRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('vote_yes')
                        .setLabel(`✅ ${votesYes} (${yesPercent}%)`)
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('vote_no')
                        .setLabel(`❌ ${votesNo} (${noPercent}%)`)
                        .setStyle(ButtonStyle.Danger)
                );

            sentMessage.edit({ components: [updatedRow] });
        };

        const embed = new EmbedBuilder()
            .setColor('#4a0b0b')
            .setTitle('HypeHost.pl | Propozycja')
            .setAuthor({ name: 'Autor Propozycji:', iconURL: message.author.displayAvatarURL(), url: `https://discord.com/users/${message.author.id}` })
            .setDescription(`**Treść Propozycji:**\n\`\`\`${message.content}\`\`\``)
            .addFields(
                { name: 'Status Głosów:', value: `✅ ${votesYes} (0%)\n❌ ${votesNo} (0%)` }
            )
            .setThumbnail('https://i.imgur.com/AfFp7pu.png')
            .setImage('https://i.imgur.com/AfFp7pu.png')
            .setFooter({ text: '© 2024 - HypeHost.pl', iconURL: 'https://i.imgur.com/AfFp7pu.png' })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('vote_yes')
                    .setLabel('✅ 0 (0%)')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('vote_no')
                    .setLabel('❌ 0 (0%)')
                    .setStyle(ButtonStyle.Danger)
            );

        const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });

        await message.delete();

        const filter = interaction => ['vote_yes', 'vote_no'].includes(interaction.customId);
        const collector = sentMessage.createMessageComponentCollector({ filter });

        collector.on('collect', interaction => {
            const userId = interaction.user.id;

            if (voters.has(userId)) {
                const previousVote = voters.get(userId);

                if (previousVote === 'vote_yes') votesYes--;
                else if (previousVote === 'vote_no') votesNo--;
            }

            if (interaction.customId === 'vote_yes') {
                votesYes++;
                voters.set(userId, 'vote_yes');
            } else if (interaction.customId === 'vote_no') {
                votesNo++;
                voters.set(userId, 'vote_no');
            }

            updateButtons();

            const totalVotes = votesYes + votesNo;
            const yesPercent = calculatePercentage(votesYes, totalVotes);
            const noPercent = calculatePercentage(votesNo, totalVotes);

            const updatedEmbed = new EmbedBuilder(embed)
                .spliceFields(0, 1, { name: 'Status Głosów:', value: `✅ ${votesYes} (${yesPercent}%)\n❌ ${votesNo} (${noPercent}%)` });

            sentMessage.edit({ embeds: [updatedEmbed] });

            interaction.reply({ content: `Oddano głos na: ${interaction.customId === 'vote_yes' ? '✅ Tak' : '❌ Nie'}`, ephemeral: true });
        });
    },
};
