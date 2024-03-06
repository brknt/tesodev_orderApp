const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const customerController = require('./controllers/customerController');



const app = express();





//CONNECT MONGODB
mongoose.connect(process.env.MONGODB_CUSTOMER_URI, {
    useNewUrlParser: true
}).then(() => {
    console.log('Customer DB connection successful');
}).catch((err) => {
    console.log(`Customer DB connection failed error = ${err}`);

});


// MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(express.json());






app.post("/create",customerController.create);
//app.post("/update",customerController.update);





const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Customer-Service at : ${port}`);
})