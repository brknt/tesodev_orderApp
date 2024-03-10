const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const AuditSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => uuidv4(),
        required: true,
    },
    orderId:{
        type:String
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
    },
    endpoint:{
        type:String
    }

},
    {
        timestamps: true
    });


const Audit = mongoose.model('audit', AuditSchema,'auditsLog');


module.exports = Audit;