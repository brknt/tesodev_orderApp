const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const messageBroker = require('./RabbitMQ/messageBroker');
const config = require('./config/config');
const orderRoutes = require('./routes/orderRoutes');
const cron = require('node-cron');
const { sendToEmail } = require('./controllers/orderController.js');


const app = express();
const port = config.PORT;


//CONNECT MONGODB
mongoose.connect(config.MONGO_URI, {
}).then(() => {
    console.log('Order DB connection successful');
}).catch((err) => {
    console.log(`Order DB connection failed error = ${err}`);

});



//CRON SCHEDULE
cron.schedule("*/10 * * * * *", function () {//0 0 * * *
    console.log("------------------------");
    sendToEmail()
    console.log("Running task at everyday");
})



//MIDDLEWARE

app.use(express.urlencoded({ extended: true }));
app.use(express.json());




//CONNECT RABBITMQ
messageBroker.OrderConsumer();


app.use('/order', orderRoutes.routes);



app.listen(port, () => {
    console.log(`Order-Service at : ${port}`);
})