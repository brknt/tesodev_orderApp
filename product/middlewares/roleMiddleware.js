const jwt = require('jsonwebtoken');
require('dotenv').config();
const config = require('../config/config');
const utils = require('../utils/utils');


module.exports = (roles) => {
    return (req, res, next) => {
        const token = req.cookies.jwt;
        if (token) {
            jwt.verify(token, config.JWT_SECRET, (err, decodedToken) => {
                if (err) {
                    return res.status(401).json({ message: 'Unauthorized.Please Login' });
                } else {
                    req.user = decodedToken;
                    const userRole = req.user.role;
                    if (roles.includes(userRole)) {
                            next();
                    } else {

                        return res.status(utils.Enum.HTTP_CODES.BAD_REQUEST).json({ result: "You cant do it!" });

                    }


                }
            });
        } else {
            return res.status(401).json({ message: 'Unauthorized.Please Login' });
        }
    }

}