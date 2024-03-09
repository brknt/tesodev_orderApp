require('dotenv').config();

module.exports = {
    MONGO_URI: process.env.MONGODB_PRODUCT_URI || "mongodb://localhost/orderDB",
    RABBITMQ_URI: process.env.RABBITMQ_URI || "amqp://127.0.0.1:5672",
    PORT: process.env.PORT || 8083
}