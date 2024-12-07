const { LavalinkManager } = require('lavalink-client');
const getAllFiles = require('../utils/getAllFiles');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

module.exports = (client) => {
  const clientId = process.env.CLIENT_ID;
  const auth = process.env.NODE_AUTHORIZATION;
  const host = process.env.NODE_HOST;
  const port = parseInt(process.env.NODE_PORT);
  const id = process.env.NODE_ID;

  client.lavalink = new LavalinkManager({
    nodes: [
      {
          authorization: auth,
          host: host,
          port: port,
          id: id,
      }
  ],
    sendToShard: (guildId, payload) =>
        client.guilds.cache.get(guildId)?.shard?.send(payload),
    client: {
        id: clientId,
        username: "Auros",
    },
    autoSkip: true,
    playerOptions: {
        clientBasedPositionUpdateInterval: 150,
        defaultSearchPlatform: "ytsearch",
        volumeDecrementer: 0.75,
        onDisconnect: {
            autoReconnect: false, 
            destroyPlayer: true 
        },
        onEmptyQueue: {
            destroyAfterMs: 30_000, 
        }
    },
    queueOptions: {
        maxPreviousTracks: 25
    },
});

    client.on("raw", d => client.lavalink.sendRawData(d)); // send raw data to lavalink-client to handle stuff
    
    client.on("ready", () => {
        client.lavalink.init(client.user);
    });

    const eventFiles = getAllFiles(path.join(__dirname, '../events/lavalink'));

    eventFiles.sort((a, b) => a > b);
    
    for (const eventFile of eventFiles) {
      const eventName = path.basename(eventFile, path.extname(eventFile));
         
      client.lavalink.on(eventName, async (player, ...args) => {
        try {
          const eventFunction = require(eventFile);
          if (typeof eventFunction === 'function') {
            await eventFunction(client, player, ...args);
          } else {
            console.error(`Event file ${eventFile} does not export a function`);
          }
        } catch (error) {
          console.error(`Error loading event file ${eventFile}:`, error);
        }
      });
    }
}