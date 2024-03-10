const utils = require('../utils/utils');
const Order = require('../models/Order');
const Address = require('../models/Address');
const Audit = require('../models/Audit');
const config = require('../config/config');
const nodemailer = require('nodemailer');




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
        console.log(order);

        return res.json(utils.Response.successResponse({ success: true, result: order }, 200))

    } catch (error) {
        let errorResponse = utils.Response.errorResponse(error);
        return res.status(errorResponse.code).json(errorResponse);
    }
}



const changeStatus = async (req, res) => {
    try {

        const data = req.body;
        console.log(data);

        const order = await Order.findOne({ _id: req.params.id });
        if (!order) {
            return res.status(utils.Enum.HTTP_CODES.BAD_REQUEST).json({ results: `Cannot update order status` });

        }
        order.status = data.status;
        order.save();
        //return res.json(utils.Response.successResponse({ success: true }, 200));

    } catch (error) {
        let errorResponse = utils.Response.errorResponse(error);
        return res.status(errorResponse.code).json(errorResponse);
    }
}





const sendToEmail = async () => {
    try {
        

        const audits = await Audit.find();

        if (audits.length > 0) {
            const outputMessage = `
            <h1>OrderLogs</h1>
            <h2>Logs:</h1>
            <pre>
            <code>
            ${audits}
            </code>
            </pre>
        
        `;

            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: config.NODEMAILER_USER,
                    pass: config.NODEMAILER_PASS,
                },
            });

            await transporter.sendMail({
                from: ` "Tesodev OrderApp OrderLogs File :" ${config.NODEMAILER_USER} `,
                to: 'brknt.gns@hotmail.com',
                subject: 'Tesodev OrderApp OrderLogs File ✔',
                html: outputMessage,
                text: outputMessage

            }, (err, info) => {
                if (err) {
                    console.log("Error:", err);
                } else {
                    console.log('Message sent: %s', info.messageId);
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                }
            });

        }


    } catch (error) {
        console.log('sendToEmailError::',error);
        
    }
}


module.exports = {
    update,
    getAll,
    getById,
    Delete,
    changeStatus,
    sendToEmail

}