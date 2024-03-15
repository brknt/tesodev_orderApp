require('dotenv').config();

module.exports = {
    MONGO_URI: process.env.MONGODB_ORDER_URI || "mongodb://mongoDB/orderDB",
    RABBITMQ_URI: process.env.RABBITMQ_URI || "amqp://guest:guest@rabbitMQ:5672",
    PORT: process.env.PORT || 8083,
    JWT_SECRET: process.env.JWT_SECRET || "tesodev_secret",
    NODEMAILER_USER: process.env.NODEMAILER_USER || "brknt.8811@gmail.com",
    NODEMAILER_PASS: process.env.NODEMAILER_PASS || "npvz fzsa tkiz mtug"
}