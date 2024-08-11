const { Client, GatewayIntentBits } = require('discord.js');
const config = require('./config.json');
const { loadCommands, loadEvents, deployCommands } = require('./handlers/handlerCommand');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

client.commands = new Map();

loadCommands(client);
loadEvents(client);

deployCommands();

client.login(config.token);
