const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const OrderSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => uuidv4(),
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1

    },
    price: {
        type: Number,
        required: true

    },
    status: {
        type: String,

    },
    address: {
        type: String,
        ref: 'Address'

    },
    products:
        [{
            _id: { type: String, require: true },
            name: { type: String },
            price: { type: Number },
            imageUrl: { type: String }
        }
        ],

    customerId: {
        type: String,
        required: true
    }

},
    {
        timestamps: true
    });


const Order = mongoose.model('Order', OrderSchema);


module.exports = Order;