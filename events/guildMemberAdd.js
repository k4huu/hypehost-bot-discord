const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'guildMemberAdd',
    execute(member) {
        const channel = member.guild.channels.cache.get(config.welcomeChannelId);
        if (!channel) return;

        const welcomeEmbed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle(`👋 Witamy na ${config.serverName}!`)
            .setDescription(`${config.welcomeMessage}`)
            .addFields(
                { name: 'Użytkownik:', value: `<@${member.user.id}>`, inline: true },
                { name: 'ID Użytkownika:', value: `${member.user.id}`, inline: true }
            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setImage('https://i.imgur.com/AfFp7pu.png') 
            .setFooter({ text: `Cieszymy się, że jesteś z nami!`, iconURL: 'https://i.imgur.com/AfFp7pu.png' })
            .setTimestamp();

        channel.send({ embeds: [welcomeEmbed] });
    },
};
