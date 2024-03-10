require('dotenv').config();

module.exports = {
    MONGO_URI: process.env.MONGODB_PRODUCT_URI || "mongodb://localhost/orderDB",
    MONGO_URI_AUDIT: process.env.MONGODB_AUDIT_URI || "mongodb://localhost/auditDB",
    RABBITMQ_URI: process.env.RABBITMQ_URI || "amqp://127.0.0.1:5672",
    PORT: process.env.PORT || 8083,
    NODEMAILER_USER: process.env.NODEMAILER_USER || "brknt.8811@gmail.com",
    NODEMAILER_PASS: process.env.NODEMAILER_PASS || "npvz fzsa tkiz mtug"
}