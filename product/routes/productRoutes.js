const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const isAuthenticated = require('../middlewares/isAuthenticated');




router.post('/create', productController.create);
router.get('/', productController.getAll);
router.post('/buy', isAuthenticated, productController.createOrder);
router.patch('/update', isAuthenticated, productController.createOrder);




module.exports = {
    routes: router
}