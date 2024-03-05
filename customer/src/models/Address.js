const mongoose = require('mongoose');


const AddressSchema = new mongoose.Schema({
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

});



const Address = mongoose.model('Address', AddressSchema);


module.exports = Address;