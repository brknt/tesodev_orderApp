const Address = require('../models/Address');
const Customer = require('../models/Customer');
const joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const utils = require('../utils/utils');



//register
const create = async (req, res) => {
    try {

        const data = req.body;
        const customerExists = await Customer.findOne({ email: data.email });
        if (customerExists) {
            return res.status(utils.Enum.HTTP_CODES.BAD_REQUEST).json({ result: "Such a customer already exists!" });

        } else {

            const address = await Address.create(data.address);
            const newCustomer = new Customer({
                name: data.name,
                email: data.email,
                password: data.password,
                address: address._id
            });

            await newCustomer.save();

            return res.status(utils.Enum.HTTP_CODES.CREATED).json(utils.Response.successResponse({ success: true, result: newCustomer._id }, 201));

        }

    } catch (error) {
        let errorResponse = utils.Response.errorResponse(error);
        return res.status(errorResponse.code).json(errorResponse);

    }
}


const update = async (req, res) => {
    try {

        const data = req.body;
        const customer = await Customer.findOne({ _id: req.params.id }).populate('address');

        if (!customer) {
            return res.status(utils.Enum.HTTP_CODES.BAD_REQUEST).json({ result: `There is no customer registered to ${data.email}` });
        } else {
            customer.name = data.name;
            customer.password = data.password;

            const address = await Address.findOne({ _id: customer.address._id });
            address.addressLine = data.address.addressLine;
            address.city = data.address.city;
            address.country = data.address.country;
            address.cityCode = data.address.cityCode;
            await address.save();
            await customer.save();

            return res.json(utils.Response.successResponse({ success: true }, 200));

        }

    } catch (error) {
        let errorResponse = utils.Response.errorResponse(error);
        return res.status(errorResponse.code).json(errorResponse);

    }
}


const Delete = async (req, res) => {
    try {

        const customer = await Customer.findOneAndDelete({ _id: req.params.id });
        if (!customer) {
            return res.status(utils.Enum.HTTP_CODES.BAD_REQUEST).json({ result: `There is no customer registered` });

        } else {
            await Address.findOneAndDelete({ _id: customer.address });

            return res.json(utils.Response.successResponse({ success: true }, 200));

        }


    } catch (error) {
        let errorResponse = utils.Response.errorResponse(error);
        return res.status(errorResponse.code).json(errorResponse);
    }
}


const getAll = async (req, res) => {
    try {
        const customers = await Customer.find();
        return res.json(utils.Response.successResponse({ success: true, result: customers }, 200))

    } catch (error) {
        let errorResponse = utils.Response.errorResponse(error);
        return res.status(errorResponse.code).json(errorResponse);
    }
}


const getById = async (req, res) => {
    try {

        const [customer] = await Customer.find({ _id: req.params.id });

        if (!customer) {
            return res.status(utils.Enum.HTTP_CODES.BAD_REQUEST).json({ result: `There is no customer registered` });

        }

        return res.json(utils.Response.successResponse({ success: true, result: customer }, 200))



    } catch (error) {
        let errorResponse = utils.Response.errorResponse(error);
        return res.status(errorResponse.code).json(errorResponse);
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(utils.Enum.HTTP_CODES.UNAUTHORIZED).json({ result: `Invalid email or password` });

        }
        const compare = await bcrypt.compare(password, customer.password);
        if (!compare) {
            return res.status(utils.Enum.HTTP_CODES.UNAUTHORIZED).json({ result: `Invalid email or password` });
        }
        
        const payload = {
            id: customer._id,
            role:customer.role
        };
        const token = jwt.sign(payload, config.JWT_SECRET, {
            expiresIn: '1d'
        });
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24
        });

        return res.json(utils.Response.successResponse({ success: true, token: token }, 200));

    } catch (error) {
        let errorResponse = utils.Response.errorResponse(error);
        return res.status(errorResponse.code).json(errorResponse);
    }
}

const logout = async (req, res) => {
    try {
       

        res.cookie('jwt', " ", {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24
        });

        
        
        return res.json(utils.Response.successResponse({ success: true, result: "logout"}, 200));

    } catch (error) {
        let errorResponse = utils.Response.errorResponse(error);
        return res.status(errorResponse.code).json(errorResponse);
    }
}
const joiValidate = async (req, res, next) => {
    try {
        const data = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }

        await joi.object({

            name: joi.string().max(30).required(),
            email: joi.string().email().required(),
            password: joi.string().min(8).max(30).regex(/[a-zA-Z0-9]{3,30}/).required(),
        }).validateAsync(data);
        next();


    } catch (error) {
        let errorResponse = utils.Response.errorResponse(error);
        return res.status(errorResponse.code).json(errorResponse);

    }

}

// delete customer for test
const deleteTests = async () => {
    await Customer.deleteMany({ email:{$in:["admintest@gmail.com","customertest@gmail.com"]} });
}

module.exports = {
    create,
    update,
    Delete,
    getAll,
    getById,
    joiValidate,
    login,
    logout,
    deleteTests
}