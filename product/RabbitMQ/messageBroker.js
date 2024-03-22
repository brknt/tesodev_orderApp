const amqp = require("amqplib");
const config = require('../config/config');
require('dotenv').config();



// ---------------connect rabbitmq--------------------
let channel;
let RABBITMQ_URI = config.RABBITMQ_URI;
let time = 20000;

if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev') {
  RABBITMQ_URI = "amqp://127.0.0.1:5672";
  time = 0;
}

async function connect() {
  console.log("Connecting to RabbitMQ...");

  setTimeout(async () => {
    try {
      const connection = await amqp.connect(RABBITMQ_URI);
      channel = await connection.createChannel();
      await channel.assertQueue("products");
      console.log("Product RabbitMQ connected");
    } catch (err) {
      console.error("Failed to connect to RabbitMQ:", err);
    }

  }, time); // delay 20 second



}



// ---------------publish Messsage-------------
async function publishMessage(queue, message) {
  if (!channel) {
    console.error("No RabbitMQ channel available.");
    return;
  }

  try {

    await channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(message))
    );
  } catch (err) {
    console.log(err);
  }
}




/// --------------consume Message-----------
async function consumeMessage(queue, callback) {
  if (!channel) {
    console.error("No RabbitMQ channel available.");
    return;
  }

  try {
    await channel.consume(queue, (message) => {
      const content = message.content.toString();
      const parsedContent = JSON.parse(content);
      callback(parsedContent);
      channel.ack(message);
    });
  } catch (err) {
    console.log(err);
  }
}


module.exports = {
  connect,
  publishMessage,
  consumeMessage
}
