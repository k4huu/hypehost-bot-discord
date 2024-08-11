const { ActivityType } = require('discord.js');
const config = require('../config.json');
const colors = require('colors')

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(colors.red(`[Handler] Zalogowano jako ${client.user.tag}!`));

        const statuses = config.statuses;

        let currentStatus = 0;

        const updateStatus = () => {
            const status = statuses[currentStatus];

            const activityTypeMap = {
                PLAYING: ActivityType.Playing,
                STREAMING: ActivityType.Streaming,
                LISTENING: ActivityType.Listening,
                WATCHING: ActivityType.Watching,
                COMPETING: ActivityType.Competing,
            };

            client.user.setPresence({
                activities: [{ name: status.name, type: activityTypeMap[status.type] }],
                status: 'online',
            });

            currentStatus = (currentStatus + 1) % statuses.length;
        };

        updateStatus();

        const intervalTime = 10000; 
        setInterval(updateStatus, intervalTime);
    },
};
