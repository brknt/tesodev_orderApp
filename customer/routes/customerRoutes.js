const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post("/create", customerController.joiValidate, customerController.create);
router.patch("/update/:id", roleMiddleware(["customer", "admin"]), customerController.update);
router.delete("/delete/:id", roleMiddleware("admin"), customerController.Delete);
router.get("/", roleMiddleware("admin"), customerController.getAll);
router.post("/login", customerController.login);
router.get("/logout", customerController.logout);
router.get("/:id", customerController.getById);


module.exports = {
    routes: router
}