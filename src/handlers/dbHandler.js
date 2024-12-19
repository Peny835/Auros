const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

module.exports = async (client) => {
    mongoose.connect(process.env.mongodb, {
        tls: true,
        tlsAllowInvalidCertificates: true,
      });

      mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB');
      });

      mongoose.connection.on('error', (err) => {
        console.error(`Error connecting to MongoDB: ${err}`);
      });
}
