const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');


router.patch("/update/:id", orderController.update);
router.delete("/delete/:id", orderController.Delete);
router.get("/", orderController.getAll);
router.post("/changeStatus/:id", orderController.changeStatus);
router.get("/:id", orderController.getById);



module.exports = {
    routes: router
}