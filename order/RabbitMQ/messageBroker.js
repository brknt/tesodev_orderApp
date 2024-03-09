const amqp = require("amqplib");
require('dotenv').config();
const Order = require('../models/Order');
const Address = require('../models/Address');
const config = require('../config/config');
const utils = require('../../utils/utils');

async function OrderConsumer() {
  console.log("Connecting to RabbitMQ...");

  try {
    const amqpServer = config.RABBITMQ_URI;
    const connection = await amqp.connect(amqpServer);
    console.log("Connected to RabbitMQ");
    const channel = await connection.createChannel();
    await channel.assertQueue("ORDER");

    //consume:
    channel.consume("orders", async (data) => {

      console.log("Consuming ORDER service");
      const {  products, customerId, address, orderId } = JSON.parse(data.content);
      const status = "completed";
      utils.logger.logger.log('info', `consume(orders): orderId: ${orderId}, 
      customerId: ${customerId}, status: ${status}}`
      );
      // TODO: LOG ınfo


      let newAddress = await Address.create(address);

      // console.log('status::', status);
      // console.log('address::', newAddress);
      // console.log('products::', products);
      // console.log('customerId::', customerId);
      // console.log('price::', products.reduce((acc, product) => acc + product.price, 0));

      const newOrder = await Order.create({
        status: status,
        products: products,
        customerId: customerId,
        price: products.reduce((acc, product) => acc + product.price, 0),
        address: newAddress._id,
      });

      await newOrder.save().then(() => {
        utils.logger.logger.log('info', `order created successfully: orderId: ${orderId}, 
        customerId: ${customerId}, status: ${status}}`
        );
      }).catch((err) => {
        utils.logger.logger.log('error', `order created failed:  ${err.message}`
        );
      });



      // Send ACK to ORDER service
      channel.ack(data);
      utils.logger.logger.log('info', `Order saved to DB and ACK sent to ORDER queue: orderId: ${orderId}`);


      const { customerId: savedCustomerId, products: savedProducts, price,status:savedStatus} = newOrder.toJSON();
      channel.sendToQueue(
        "products",
        Buffer.from(JSON.stringify({ orderId, customerId: savedCustomerId, products: savedProducts, price, status: savedStatus, address: newAddress }))
      )
        utils.logger.logger.log('info', `sendToQueue(products): orderId: ${orderId}, 
        customerId: ${customerId}, status: ${status}`
        );

    });
  } catch (err) {
    console.error("Failed to connect to RabbitMQ:", err.message);
  }

}


module.exports = {
  OrderConsumer
};