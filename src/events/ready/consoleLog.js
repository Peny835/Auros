const chalk = require("chalk");
const { version } = require('discord.js');

module.exports = (client) => {
    console.log(`\n\n`)
    console.log(chalk.hex('#0af50e')('---------------------------------------------------'));
    console.log(chalk.blue(`Logged in as: ${chalk.hex('#0a83f5')(client.user.tag)}`));
    console.log(chalk.blue(`Bot ID: ${chalk.hex('#9f0af5')(client.user.id)}`));
    console.log(chalk.blue(`Discord.js version: ${chalk.red(version)}`));
    console.log(chalk.hex('#0af50e')('---------------------------------------------------'));
    console.log(`\n\n`)
};