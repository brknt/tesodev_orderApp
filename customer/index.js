const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const customerRoutes = require('./routes/customerRoutes');
const config = require('./config/config');
const Customer = require('./models/Customer');


const app = express();
const port = config.PORT;
let MONGO_URI = config.MONGO_URI ;

if (process.env.NODE_ENV === 'test' ||process.env.NODE_ENV === 'dev' ) {
    MONGO_URI = "mongodb://localhost/customerDB"  
  }
  
//CONNECT MONGODB
mongoose.connect(MONGO_URI).then(async() => {
    console.log('Customer DB connection successful');
    if(!process.env.NODE_ENV === 'test'){
        const [admin] = await Customer.find({email:"admin@gmail.com"});   
        if(!admin){
            await Customer.create({
                name:"admin",
                email:"admin@gmail.com",
                password:"admin",
                role:"admin" 
            });
        }
    }
  

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