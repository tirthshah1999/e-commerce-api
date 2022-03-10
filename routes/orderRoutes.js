const express = require("express");
const router = express.Router();

const {authenticatedUser, authorizePermissions} = require("../middleware/authentication");

const {getAllOrders, getSingleOrder, getCurrentUserOrders, createOrder, updateOrder} = require('../controllers/orderController');

router.route("/")
.post(authenticatedUser, createOrder)
.get(authenticatedUser, authorizePermissions("admin"), getAllOrders)

router.route("/showAllMyOrders")
.get(authenticatedUser, getCurrentUserOrders);

router.route("/:id")
.get(authenticatedUser, getSingleOrder)
.patch(authenticatedUser, updateOrder);

module.exports = router;