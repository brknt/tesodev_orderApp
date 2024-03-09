const { createLogger, transports, format } = require('winston');
require('winston-mongodb');
const config = require('../config');

const logger = createLogger({
    transports: [
        new transports.File({
            filename: 'error.log',
            level: 'error',
            format: format.combine(format.timestamp(), format.json())

        }),
        new transports.MongoDB({
            level: 'info',
            db: config.MONGODB_URI,
            options: { useNewUrlParser: true },
            collection: 'audit',
            format: format.combine(format.timestamp(), format.json())
        })
    ]
})

module.exports = {
    logger
}