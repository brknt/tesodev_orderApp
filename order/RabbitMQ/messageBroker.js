const amqp = require("amqplib");
require('dotenv').config();
const Order = require('../models/Order');
const Address = require('../models/Address');
const config = require('../config/config');
const Audit = require('../models/Audit');


async function OrderConsumer() {
  console.log("Connecting to RabbitMQ...");




  try {
    
      const amqpServer = config.RABBITMQ_URI;
      const connection = await amqp.connect(amqpServer);
      console.log("Order Connected to RabbitMQ");
      const channel = await connection.createChannel();
      await channel.assertQueue("orders");
    
    //consume:
    channel.consume("orders", async (data) => {

      console.log("Consuming ORDER service");
      const { products, customerId, address, orderId } = JSON.parse(data.content);
      const status = "completed";
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

      newOrder.save();
      console.log(newOrder);


      // order create log : audit log
      const auditLog = await Audit.create({
        orderId: newOrder._id,
        price: newOrder.price,
        status: newOrder.status,
        address: newOrder.address,
        products: newOrder.products,
        customerId: newOrder.customerId,
        endpoint: "/product/buy => create order"
      });
      auditLog.save();


      // Send ACK to ORDER service
      channel.ack(data);
      console.log('log::', auditLog);

    });
  } catch (err) {console.log('burdaaa',err);
  
    console.error("Failed to connect to RabbitMQ:", err.message);
  }

}


module.exports = {
  OrderConsumer
};