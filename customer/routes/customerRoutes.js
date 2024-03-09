const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');


router.post("/create",customerController.joiValidate,customerController.create);
router.patch("/update/:id",customerController.update);
router.delete("/delete/:id",customerController.Delete);
router.get("/",customerController.getAll);
router.get("/:id",customerController.getById);
router.post("/login",customerController.login);


module.exports = {
    routes:router
}