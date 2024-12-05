const util = require('util');
const axios = require('axios');
const chalk = require('chalk');
const { testServer } = require('../../../../config.json');
const getApplicationCommands = require('../../../utils/getApplicationCommands');
const getLocalCommands = require('../../../utils/getLocalCommands');
const areCommandsDifferent = require('../../../utils/areCommandsDifferent');

module.exports = async (client) => {
    const localCommands = getLocalCommands(client);
    const applicationCommands = await getApplicationCommands(client, testServer);

    for (const applicationCommand of applicationCommands) {

        const existingCommand = localCommands.find(
            (command) => command.data.name === applicationCommand.name
        );
        
        if (!existingCommand) {
            await axios.delete(testServer ? `https://discord.com/api/v9/applications/${client.user.id}/guilds/${testServer}/commands/${applicationCommand.id}` : `https://discord.com/api/v9/applications/${client.user.id}/commands/${applicationCommand.id}`, {
                headers: {
                    Authorization: `Bot ${client.token}`,
                },
            
            }).catch((error) => {
                console.error(error)})
                .then(() => {
                    console.log(chalk.redBright(`Command ${applicationCommand.name} has been deleted`));   
                });
    }
}
        for (const localCommand of localCommands) {
            
            const existingCommand = applicationCommands.find(
                (command) => command.name === localCommand.data.name
            );
            
            if (existingCommand) {
                if (areCommandsDifferent(existingCommand, localCommand)) {
                    console.log(chalk.yellowBright(`Command ${localCommand.data.name} is different`));
                    await axios.patch(testServer ? `https://discord.com/api/v9/applications/${client.user.id}/guilds/${testServer}/commands/${existingCommand.id}` : `https://discord.com/api/v9/applications/${client.user.id}/commands/${existingCommand.id}`, localCommand.data.toJSON(), {
                        headers: {
                            Authorization: `Bot ${client.token}`,
                        },
                    }).catch((error) => {
                        console.error(error);
                    }).then(() => {
                        console.log(chalk.blueBright(`Command ${localCommand.data.name} has been updated`));
                    });
                }
            } else {
                await axios.post(testServer ? `https://discord.com/api/v9/applications/${client.user.id}/guilds/${testServer}/commands` : `https://discord.com/api/v9/applications/${client.user.id}/commands`, localCommand.data.toJSON(), {
                    headers: {
                        Authorization: `Bot ${client.token}`,
                    },
                }).catch((error) => {
                    console.error(error);
                }).then(() => {
                    console.log(chalk.greenBright(`Command ${localCommand.data.name} has been registered`));
                });
            }
        }
}