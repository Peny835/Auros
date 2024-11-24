module.exports = async (client, testServer) => {
    let applicationCommands;
  
    if (testServer) {
      const guild = await client.guilds.fetch(testServer);
      applicationCommands = guild.commands;
    } else {
      applicationCommands = await client.application.commands;
    }
  
    await applicationCommands.fetch();
    return applicationCommands;
  };