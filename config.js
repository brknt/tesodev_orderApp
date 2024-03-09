require('dotenv').config();

module.exports = {
    MONGODB_URI: process.env.MONGODB_LOGGER_URI || " mongodb://localhost/auditDB"
}