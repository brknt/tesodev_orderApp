const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const CustomerSchema = new mongoose.Schema({
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
    const user = this;
    bcrypt.hash(user.password, 10, (err, hash) => {
        user.password = hash;
        next();
    });
});


const Customer = mongoose.model('Customer', CustomerSchema);


module.exports = Customer;