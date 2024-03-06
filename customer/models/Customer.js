const mongoose = require('mongoose');
const bcrypt = require('bcrypt');




var CustomerSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true

    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
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