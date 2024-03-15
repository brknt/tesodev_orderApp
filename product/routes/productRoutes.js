const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const roleMiddleware = require('../middlewares/roleMiddleware');



router.post('/create', roleMiddleware(["customer", "admin"]), productController.create);
router.get('/',  productController.getAll);
router.post('/buy', roleMiddleware("customer"), productController.createOrder);




module.exports = {
    routes: router
}