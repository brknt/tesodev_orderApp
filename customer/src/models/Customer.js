const mongoose = require('mongoose');


const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true

    },
    email: {
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



const Customer = mongoose.model('Customer', CustomerSchema);


module.exports = Customer;