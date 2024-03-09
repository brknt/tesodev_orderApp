const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const messageBroker = require('./RabbitMQ/messageBroker');
const config = require('./config/config');
const orderRoutes = require('./routes/orderRoutes');


const app = express();
const port = config.PORT;



//CONNECT MONGODB
mongoose.connect(config.MONGO_URI, {
    useNewUrlParser: true
}).then(() => {
    console.log('Order DB connection successful');
}).catch((err) => {
    console.log(`Order DB connection failed error = ${err}`);

});


//MIDDLEWARE

app.use(express.urlencoded({ extended: true }));
app.use(express.json());




//CONNECT RABBITMQ
messageBroker.OrderConsumer();


app.use('/order', orderRoutes.routes);



app.listen(port, () => {
    console.log(`Order-Service at : ${port}`);
})