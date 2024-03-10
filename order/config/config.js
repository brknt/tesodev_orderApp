require('dotenv').config();

module.exports = {
    MONGO_URI: process.env.MONGODB_PRODUCT_URI || "mongodb://localhost/orderDB",
    MONGO_URI_AUDIT: process.env.MONGODB_AUDIT_URI || "mongodb://localhost/auditDB",
    RABBITMQ_URI: process.env.RABBITMQ_URI || "amqp://127.0.0.1:5672",
    PORT: process.env.PORT || 8083
}