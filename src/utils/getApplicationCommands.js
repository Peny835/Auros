const axios = require('axios');

module.exports = async (client, guildId) => {
  const applicationId = client.user.id; 
  const token = client.token; 
  const url = guildId ? `https://discord.com/api/v9/applications/${applicationId}/guilds/${guildId}/commands` : `https://discord.com/api/v9/applications/${applicationId}/commands`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bot ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}