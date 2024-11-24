const chalk = require('chalk');
const { testServer } = require('../../../config.json');
const areCommandsDifferent = require('../../utils/areCommandsDifferent');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');
const { SlashCommandSubcommandBuilder, SlashCommandStringOption } = require('discord.js');
const test = false;

module.exports = async (client) => {
    const applicationCommands = await getApplicationCommands(
      client, 
      !test ? undefined : testServer
    );
    const localCommands = getLocalCommands();
    console.log(chalk.yellow(`Registering commands in ${!test ? 'production' : testServer} server`));

    // Delete commands that exist in application but not locally
    for (const applicationCommand of applicationCommands.cache.values()) {
      const localCommand = localCommands.find(
        (cmd) => cmd.data.name === applicationCommand.name
      );

      if (!localCommand) {
        await applicationCommands.delete(applicationCommand.id);
        console.log(chalk.yellow(`❌ Deleted non-local command: ${applicationCommand.name}`));
      }
    }

    for (const localCommand of localCommands) {
      const { name, description, options = []} = localCommand.data;

      // Funkcja, która sprawdza typ opcji i ustawia go na 1 w przypadku podkomend
      const formattedOptions = options.map((option) => {
        if (option instanceof SlashCommandSubcommandBuilder) {
          // Jeśli opcja jest podkomendą, przypisujemy type: 1
          option.type = 1;
        } else if (option instanceof SlashCommandStringOption) {
          // Dla innych opcji, takich jak string, ustawiamy type: 3
          option.type = 3;
        }

        // W przypadku innych typów można dodać dodatkową logikę
        return option;
      });

      const existingCommand = applicationCommands.cache.find(
        (cmd) => cmd.name === name
      );

      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log(chalk.yellow(`❌ Command deleted: ${name}`));
          continue;
        }

        if (areCommandsDifferent(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            name,
            description,
            options: formattedOptions,
          });
          console.log(chalk.green(`✅ Command updated: ${name}`));
        }
      } else {
        if (localCommand.deleted) {
          console.log(chalk.yellow(`Skipping command ${name} because it was deleted`));
          continue;
        }

        await applicationCommands.create({
          name,
          description,
          options: formattedOptions,
        });
        console.log(chalk.green(`✅ Command registered: ${name}`));

        if (options) {
          options.forEach((option) => {
            if (option.type === 1) { // Subcommand type
              console.log(chalk.blue(`  ↳ Subcommand registered: ${option.name}`));
            }
          });
        }
      }
    }
};
