const Address = require('../models/Address');
const Customer = require('../models/Customer');
const Response = require('../../../utils/Response');


const register = async (req, res) => {
    try {

        const data = req.body;
        const address = await Address.create(data.address);

        const newCustomer = await Customer.create({
            name:data.name,
            email:data.email,
            address:address._id
        })
        
        return res.json(Response.successResponse({ success: true, result: newCustomer }, 201));

    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        return res.status(errorResponse.code).json(errorResponse);

    }
}





module.exports = {
    register
}