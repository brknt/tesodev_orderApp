const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');



const ProductSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => uuidv4(),
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    imageUrl: {
        type: String,
        required: true
    },
    customerId:{
        type:String,
        ref: 'Customer'
    }
});


const Product = new mongoose.model('Product', ProductSchema);

module.exports = Product;