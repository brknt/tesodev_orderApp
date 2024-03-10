const utils = require('../../utils/utils');
const Order = require('../models/Order');
const Address = require('../models/Address');



const update = async (req, res) => {
    try {
        const data = req.body;
        const order = await Order.findOne({ _id: req.params.id }).populate('address');
        if (!order) {
            return res.status(utils.Enum.HTTP_CODES.UNAUTHORIZED).json({ results: `There is no order` });
        }
        order.status = data.status;
        order.products = data.products;
        order.price = data.products.reduce((acc, product) => acc + product.price, 0)
        order.save();

        const address = await Address.findOne({ _id: order.address._id });
        address.addressLine = data.address.addressLine;
        address.city = data.address.city;
        address.country = data.address.country;
        address.cityCode = data.address.cityCode;
        address.save();

        return res.json(utils.Response.successResponse({ success: true }, 200));



    } catch (error) {
        let errorResponse = utils.Response.errorResponse(error);
        return res.status(errorResponse.code).json(errorResponse);
    }
}

const Delete = async (req, res) => {
    try {

        const order = await Order.findOneAndDelete({ _id: req.params.id });
        if (!order) {
            return res.status(utils.Enum.HTTP_CODES.BAD_REQUEST).json({ results: `There is no order ` });

        } else {

            await Address.findOneAndDelete({ _id: order.address });

            return res.json(utils.Response.successResponse({ success: true }, 200));

        }


    } catch (error) {
        let errorResponse = utils.Response.errorResponse(error);
        return res.status(errorResponse.code).json(errorResponse);
    }
}



const getAll = async (req, res) => {
    try {
        const orders = await Order.find().populate('address')
        return res.json(utils.Response.successResponse({ success: true, result: orders }, 200))

    } catch (error) {
        let errorResponse = utils.Response.errorResponse(error);
        return res.status(errorResponse.code).json(errorResponse);
    }
}


const getById = async (req, res) => {
    try {
        const [order] = await Order.find({ _id: req.params.id }).populate('address');
        return res.json(utils.Response.successResponse({ success: true, result: order }, 200))

    } catch (error) {
        let errorResponse = utils.Response.errorResponse(error);
        return res.status(errorResponse.code).json(errorResponse);
    }
}



const changeStatus = async (req, res, [id], [status]) => {
    try {
        const data = req.body;
        console.log(data);

        const order = await Order.findOne({ _id: req.params.id });
        if (!order) {
            return res.status(utils.Enum.HTTP_CODES.BAD_REQUEST).json({ results: `Cannot update order status` });

        }
        order.status = data.status;
        order.save();
        return res.json(utils.Response.successResponse({ success: true }, 200));

    } catch (error) {
        let errorResponse = utils.Response.errorResponse(error);
        return res.status(errorResponse.code).json(errorResponse);
    }
}


module.exports = {
    update,
    getAll,
    getById,
    Delete,
    changeStatus

}