const Enum = require('./Enum');
const CustomError = require('./CustomError');

class Response {

    constructor() { }

    // Success Response:
    static successResponse(data, code) {
        return {
            code: code || 200,
            data
        };

    }


    // Error Response:
    static errorResponse(error) {

        if (error instanceof CustomError) {
            return {
                code: error.code,
                error: {
                    message: error.message,
                    description: error.description
                }
            }
        }

        else if (error.message.includes("E11000")) {
            return {
                code: Enum.HTTP_CODES.CONFLICT,
                error: {
                    message: "Already Exist!",
                    description: "Already Exist!"
                }
            }
        }
        else if (error.stack.includes("ValidationError")) {
            return {
                code: Enum.HTTP_CODES.CONFLICT,
                error: {
                    message: "ValidationError",
                    description: error.message
                }
            }
        }


        return {
            code: Enum.HTTP_CODES.INT_SERVER_ERROR,
            error: {
                message: "Unknown Error",
                description: error.message
            }
        }


    }

}




module.exports = Response;