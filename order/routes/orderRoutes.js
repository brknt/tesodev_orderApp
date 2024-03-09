const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');



//router.delete("/delete/:id",orderController.Delete);
//router.get("/",orderController.getAll);
//router.get("/:id",orderController.getById);
//router.post("/changeStatus/:id",orderController.changeStatus);



module.exports = {
    routes: router
}