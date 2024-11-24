const { ShardingManager } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const manager = new ShardingManager('./src/app.js', { token: process.env.token});

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();