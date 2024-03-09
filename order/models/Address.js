const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');




const AddressSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => uuidv4(),
        required: true,
    },
    addressLine: {
        type: String

    },
    city: {
        type: String,
        required: true

    },
    country: {
        type: String,
        required: true

    },
    cityCode: {
        type: Number,
        required: true

    }

}, { collection: 'address' });



const Address = mongoose.model('Address', AddressSchema);


module.exports = Address;