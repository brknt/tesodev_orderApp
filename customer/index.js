const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const customerRoutes = require('./routes/customerRoutes');
const config = require('./config/config');


const app = express();
const port = config.PORT;
let MONGO_URI = config.MONGO_URI ;

if (process.env.NODE_ENV === 'test') {
    MONGO_URI = "mongodb://localhost/customerDB"  
  }
  
//CONNECT MONGODB
mongoose.connect(MONGO_URI).then(() => {
    console.log('Customer DB connection successful');
}).catch((err) => {
    console.log(`Customer DB connection failed error = ${err}`);

});


// MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());


//Routes
app.use('/', customerRoutes.routes);






app.listen(port, () => {
    console.log(`Customer-service started on port: ${port}`);
})

module.exports =  app;