const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const customerController = require('./src/controllers/customerController');



const app = express();





//CONNECT MONGODB
mongoose.connect(process.env.MONGODB_CUSTOMER_URI, {
    useNewUrlParser: true
}).then(() => {
    console.log('Database connection successful');
}).catch((err) => {
    console.log(`Database connection failed error = ${err}`);

});


// MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(express.json());






app.post("/register",customerController.register);
// app.post("/register", (req, res) => this.authController.register(req, res));
//app.get("/dashboard", authMiddleware, (req, res) => res.json({ message: "Welcome to dashboard" }));




const port = process.env.PORT || 8081;
app.listen(port, () => {
    console.log(`App started on port : ${port}`);
})