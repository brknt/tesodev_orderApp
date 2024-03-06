const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const customerController = require('./controllers/customerController');
const customerValidator = require('./middlewares/customerValidator');



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






app.post("/create",customerValidator.joiValidate,customerController.create);
app.patch("/update/:id",customerController.update);
app.delete("/delete/:id",customerController.Delete);
app.get("/",customerController.getAll);
app.get("/:id",customerController.getById);





const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Customer-Service at : ${port}`);
})