const express = require("express");
const router = express.Router();

const orderController = require("../Controllers/orderController");
const { protect } = require("../Middlewares/authMiddleware");
const {adminOnly} = require("../Middlewares/adminMiddleware");

// For Public :
router.post("/orderPlace", protect, orderController.placeOrder);
router.get("/getmyorder", protect, orderController.getMyOrders);
router.delete("/orderCancel/:orderId", protect, orderController.cancelOrder);

// For Admin :
router.get("/getAllorders", protect, adminOnly, orderController.getAllOrders);
router.put("/updateOrderStatus/:orderId", protect, adminOnly, orderController.updateOrderStatus);

module.exports=router;