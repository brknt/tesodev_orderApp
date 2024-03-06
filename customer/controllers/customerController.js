const Address = require('../models/Address');
const Customer = require('../models/Customer');
const Response = require('../../utils/Response');
const Enum = require('../../utils/Enum');
const { v4: uuidv4 } = require('uuid');


const create = async (req, res) => {
    try {

        const data = req.body;
        const customerExists = await Customer.findOne({ email: data.email });
        if (customerExists) {
            return res.status(Enum.HTTP_CODES.UNAUTHORIZED).json({ results: "Such a user already exists!" });
        } else {
            const address = await Address.create(data.address);

            const id = uuidv4();
            const newCustomer = new Customer({
                id: id,
                name: data.name,
                email: data.email,
                password: data.password,
                address: address._id
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
        const customer = await Customer.findOne({ id: req.params.id }).populate('address');

        if (!customer) {
            return res.status(Enum.HTTP_CODES.UNAUTHORIZED).json({ results: `There is no customer registered to ${data.email}` });
        } else {
            customer.name = data.name;
            customer.password = data.password;

            const address = await Address.findOne({ _id: customer.address._id });
            address.addressLine = data.address.addressLine;
            address.city = data.address.city;
            address.country = data.address.country;
            address.cityCode = data.address.cityCode;
            address.save();
            customer.save();

            return res.json(Response.successResponse({ success: true }, 200));

        }

    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        return res.status(errorResponse.code).json(errorResponse);

    }
}


const Delete = async (req, res) => {
    try {

        const customer = await Customer.findOneAndDelete({ id: req.params.id });
        if (!customer) {
            return res.status(Enum.HTTP_CODES.UNAUTHORIZED).json({ results: `There is no customer registered` });

        } else {
            await Address.findOneAndDelete({ _id: customer.address._id });

            return res.json(Response.successResponse({ success: true }, 200));

        }


    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        return res.status(errorResponse.code).json(errorResponse);
    }
}


const getAll = async (req,res) =>{
    try {
        const customers = await Customer.find();
        return res.json(Response.successResponse({success:true,result:customers}))
        
    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        return res.status(errorResponse.code).json(errorResponse);
    }
}


const getById = async (req,res)=>{
    try {
        const [customer] = await Customer.find({id:req.params.id});
        return res.json(Response.successResponse({success:true,result:customer}))
        
    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        return res.status(errorResponse.code).json(errorResponse);
    }
}






module.exports = {
    create,
    update,
    Delete,
    getAll,
    getById
}