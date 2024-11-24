const { Client, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
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

client.login(process.env.TOKEN);