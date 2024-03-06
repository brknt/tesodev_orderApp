const Address = require('../models/Address');
const Customer = require('../models/Customer');
const Response = require('../../utils/Response');
const { v4: uuidv4 } = require('uuid');


const create = async (req, res) => {
    try {

        const data = req.body;
        const customerExists = await Customer.findOne({ email:data.email });
        if (customerExists) {
            return res.status(Enum.HTTP_CODES.UNAUTHORIZED).json({ results: "Such a user already exists!" });
        } else {
            const address = await Address.create(data.address);

            const id = uuidv4();
            const newCustomer = new Customer({
                id:id,
                name:data.name,
                email:data.email,
                password:data.password,
                address:address._id
            });
            
            newCustomer.save();
            
            
            return res.json(Response.successResponse({ success: true, result: newCustomer }, 201));

        }

    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        return res.status(errorResponse.code).json(errorResponse);

    }
}


const update = async (req, res) => {
    try {

        const data = req.body;
        const customerExists = await Customer.findOne({ email });
        if (customerExists) {
            return res.status(Enum.HTTP_CODES.UNAUTHORIZED).json({ results: "Such a user already exists!" });
        } else {
            const address = await Address.create(data.address);
            const newCustomer = await Customer.create({
                name: data.name,
                email: data.email,
                address: address._id
            });

            return res.json(Response.successResponse({ success: true, result: newCustomer }, 201));

        }

    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        return res.status(errorResponse.code).json(errorResponse);

    }
}






module.exports = {
    create
}