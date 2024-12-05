const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

module.exports = async (client) => {
    mongoose.connect(process.env.mongodb, {
        tls: true,
        tlsAllowInvalidCertificates: true,
      });
}
