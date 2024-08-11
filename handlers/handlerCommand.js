const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
const config = require('../config.json');
const colors = require('colors');

function loadCommandsFromDirectory(directory, client) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            loadCommandsFromDirectory(filePath, client);
        } else if (file.endsWith('.js')) {
            const command = require(filePath);
            client.commands.set(command.data.name, command);
            console.log(colors.red(`[Handler] Wczytano komendę: ${command.data.name}`));
        }
    }
}

module.exports = {
    loadCommands(client) {
        const commandsPath = path.join(__dirname, '../commands');
        loadCommandsFromDirectory(commandsPath, client);

        console.log(colors.red('[Handler] Wszystkie komendy zostały wczytane.'));
    },

    loadEvents(client) {
        const eventsPath = path.join(__dirname, '../events');
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = require(path.join(eventsPath, file));
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
            console.log(colors.red(`[Handler] Wczytano event: ${event.name}`));
        }

        console.log(colors.red('[Handler] Wszystkie eventy zostały wczytane.'));
    },

    async deployCommands() {
        const commands = [];
        const commandsPath = path.join(__dirname, '../commands');
        const commandFiles = fs.readdirSync(commandsPath);

        function loadAllCommands(directory) {
            const files = fs.readdirSync(directory);

            for (const file of files) {
                const filePath = path.join(directory, file);
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                    loadAllCommands(filePath);
                } else if (file.endsWith('.js')) {
                    const command = require(filePath);
                    commands.push(command.data.toJSON());
                }
            }
        }

        loadAllCommands(commandsPath);

        const rest = new REST({ version: '10' }).setToken(config.token);

        try {
            await rest.put(
                Routes.applicationGuildCommands(config.clientId, config.guildId),
                { body: commands },
            );

            console.log(colors.green('[Handler] Odświeżono wszystkie komendy i eventy pomyslnie.'));
        } catch (error) {
            console.error(colors.red(`[Handler] Błąd podczas odświeżania komend: ${error}`));
        }
    },
};
