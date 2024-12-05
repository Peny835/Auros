const { Client, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
const eventHandler = require('./handlers/eventHandler');
const lavalinkHandler = require('./handlers/lavalinkHandler');
const dbHandler = require('./handlers/dbHandler');

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ]
});

lavalinkHandler(client);

eventHandler(client);

dbHandler(client);

client.login(process.env.TOKEN);