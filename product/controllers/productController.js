const Product = require('../models/Product');
const { v4: uuidv4 } = require('uuid');
const messageBroker = require('../RabbitMQ/messageBroker');
const utils = require('../../utils/utils');





const create = async (req, res) => {
    try {
        const data = req.body; console.log(data);
        const newProduct = await Product.create({
            name: data.name,
            price: data.price,
            imageUrl: data.imageUrl
        });

        await newProduct.save();
        return res.json(utils.Response.successResponse({ success: true, result: newProduct }, 201))

    } catch (error) {
        let errorResponse = utils.Response.errorResponse(error);
        return res.status(errorResponse.code).json(errorResponse)
    }
}

const getAll = async (req, res) => {
    try {


        const products = await Product.find();
        return res.json(utils.Response.successResponse({ success: true, result: products }, 200));
    } catch (error) {
        let errorResponse = utils.Response.errorResponse(error);
        return res.status(errorResponse.code).json(errorResponse);
    }
}

const createOrder = async (req, res) => {
    try {

        let tempObj;
        const data = req.body;
        const { ids } = data;
        const products = await Product.find({ _id: { $in: ids } });
        // console.log("ids::",ids);
        // console.log("products::",products);
        // console.log("customerId::",req.user.id);

        const orderId = uuidv4();
        const ordersMap = new Map();

        ordersMap.set(orderId, {
            status: 'pending',
            products,
            customerId: req.user.id,
            address: data.address
        });
        utils.logger.logger.log('info', `ordersMap created: orderId: ${orderId}, 
        customerId: ${req.user.id}, status: ${ordersMap.get(orderId).status}`
        );
        // TODO: LOG ınfo




        await messageBroker.publishMessage("orders", {
            status: 'pending',
            products,
            customerId: req.user.id,
            address: data.address,
            orderId
        });
        
            utils.logger.logger.log('info', `publish(orders): orderId: ${orderId}, 
            customerId: ${req.user.id}`
            );

        messageBroker.consumeMessage("products", (data) => {

            const orderData = JSON.parse(JSON.stringify(data));
            // TODO: log info
            tempObj = {
                status: 'completed',
                products: orderData.products,
                customerId: orderData.customerId,
                address: orderData.address,
                price: orderData.price
            }

            // TODO:LOG info
            utils.logger.logger.log('info', `"Completed!" consume(products): orderId: ${orderData.orderId}, 
            customerId: ${orderData.customerId}, status: ${orderData.status}`
            );

        });

        return res.json(utils.Response.successResponse({ success: true, result: 'Order created' }, 201))
    } catch (error) {
        // log error
        let errorResponse = utils.Response.errorResponse(error);
        return res.status(errorResponse.code).json(errorResponse)
    }
}

module.exports = {
    create,
    getAll,
    createOrder
}