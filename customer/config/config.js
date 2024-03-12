require('dotenv').config();

module.exports = {
    MONGO_URI: process.env.MONGODB_CUSTOMER_URI || "mongodb://mongoDB/customerDB",
    RABBITMQ_URI: process.env.RABBITMQ_URI || "amqp://rabbitmq:5672",
    JWT_SECRET: process.env.JWT_SECRET || "tesodev_secret",
    PORT: process.env.PORT || 8081
}