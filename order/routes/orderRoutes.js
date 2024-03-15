const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.patch("/update/:id", roleMiddleware(["customer", "admin"]), orderController.update);
router.delete("/delete/:id", roleMiddleware("admin"),orderController.Delete);
router.get("/", roleMiddleware("admin"),orderController.getAll);
router.post("/changeStatus/:id", roleMiddleware("admin"), orderController.changeStatus);
router.get("/:id", orderController.getById);



module.exports = {
    routes: router
}