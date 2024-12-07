const path = require('path');
const getAllFiles = require('./getAllFiles');
const replaceNull = require('./replaceNull');
const assignCommandTypes = require('./assignCommandTypes');


module.exports = () => {
  let localCommands = [];

  const commandCategories = getAllFiles(
    path.join(__dirname, '../commands'),
    true
  );

  for (const commandCategory of commandCategories) {
    const commandFiles = getAllFiles(commandCategory);

    for (const commandFile of commandFiles) {
      const commandObject = require(commandFile);

      localCommands.push(commandObject);
    }
  }
  replaceNull(localCommands);
  assignCommandTypes(localCommands);

  return localCommands;
};