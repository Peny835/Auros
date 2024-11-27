const { REST, Routes } = require('discord.js');
const { clientId, testServer, token } = require('./config.json');
const dotenv = require('dotenv');
dotenv.config();

const rest = new REST().setToken(process.env.TOKEN);


rest.put(Routes.applicationGuildCommands(clientId, testServer), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);

// for global commands
rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);