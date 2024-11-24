const { Client, GatewayIntentBits, Events } = require('discord.js');
const dotenv = require('dotenv');
const chalk = require('chalk');
const { intents } = require('../config.json');
const eventHandler = require('./handlers/eventHandler');

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
});

eventHandler(client);
client.once(Events.Ready, () => {
    console.log(chalk.green(`Debug: Logged in as ${client.user.tag}`));
})

client.login(process.env.TOKEN);