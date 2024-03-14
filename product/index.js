const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const productRoutes = require('./routes/productRoutes');
const messageBroker = require('./RabbitMQ/messageBroker');
const cookieParser = require('cookie-parser');
const config = require('./config/config');



const app = express();
const port = config.PORT;

let MONGO_URI = config.MONGO_URI;
if (process.env.NODE_ENV === 'test' ||process.env.NODE_ENV === 'dev' ) {
    MONGO_URI = "mongodb://localhost/productDB"  
  }

//CONNECT MONGODB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true
}).then(() => {
    console.log('Product DB connection successful');

}).catch((err) => {
    console.log(`Product DB connection failed error = ${err}`);

});


//CONNECT RABBITMQ
messageBroker.connect();




//MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


//Routes
app.use('/', productRoutes.routes);





app.listen(port, () => {
    console.log(`Product-service started on port: ${port}`);
})