const joi = require('joi');
const Enum = require('../../utils/Enum');
const Response = require('../../utils/Response');


const joiValidate = async (req, res, next) => {
    try {
        const data = {
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        }
        
        await joi.object({

            name: joi.string().min(6).max(30).required(),
            email: joi.string().email().required(),
            password: joi.string().min(8).max(30).regex(/[a-zA-Z0-9]{3,30}/).required(),
        }).validateAsync(data);
        next();
        
        
    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        return res.status(errorResponse.code).json(errorResponse);

    }

}


module.exports = {joiValidate};

