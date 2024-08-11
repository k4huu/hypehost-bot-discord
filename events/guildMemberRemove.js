const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'guildMemberRemove',
    execute(member) {
        const channel = member.guild.channels.cache.get(config.goodbyeChannelId);
        if (!channel) return;

        const goodbyeEmbed = new EmbedBuilder()
            .setColor('#ff0000') 
            .setTitle(`😢 Żegnaj, ${member.user.username}`)
            .setDescription(`${config.goodbyeMessage}`)
            .addFields(
                { name: 'Użytkownik:', value: `${member.user.tag}`, inline: true },
                { name: 'ID Użytkownika:', value: `${member.user.id}`, inline: true }
            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setImage('https://i.imgur.com/AfFp7pu.png')
            .setFooter({ text: `Mamy nadzieję, że wrócisz do nas w przyszłości!`, iconURL: 'https://i.imgur.com/AfFp7pu.png' })
            .setTimestamp();

        channel.send({ embeds: [goodbyeEmbed] });
    },
};
