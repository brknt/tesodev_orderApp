require('dotenv').config();

module.exports = {
    MONGO_URI: process.env.MONGODB_PRODUCT_URI || "mongodb://mongoDB/productDB",
    RABBITMQ_URI: process.env.RABBITMQ_URI || "amqp://guest:guest@rabbitMQ:5672",
    JWT_SECRET: process.env.JWT_SECRET || "tesodev_secret",
    PORT: process.env.PORT || 8082
}