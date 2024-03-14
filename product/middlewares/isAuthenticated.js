

const jwt = require('jsonwebtoken');
require('dotenv').config();
const config = require('../config/config');

const autheticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, config.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: 'Unauthorized.Please Login' });
        } else {
          req.user = decodedToken;
          next();
        }
      });
    } else {
      return res.status(401).json({ message: 'Unauthorized.Please Login' });
    }

  } catch (error) {
    res.status(401).json({
      succeeded: false,
      error: 'Not authorized'
    });

  }
}

module.exports = autheticateToken;