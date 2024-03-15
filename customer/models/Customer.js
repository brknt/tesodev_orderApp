const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');



var CustomerSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => uuidv4(),
        required: true,
      },
    name: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true

    },
    role:{
        type: String,
        enum: ["customer","admin"],
        default: "customer"
      },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        ref: 'Address'

    }

},
    {
        timestamps: true
    });


CustomerSchema.pre('save', function (next) {
    const customer = this;
    bcrypt.hash(customer.password, 10, (err, hash) => {
        customer.password = hash;
        next();
    });
});




const Customer = mongoose.model('Customer', CustomerSchema);


module.exports = Customer;