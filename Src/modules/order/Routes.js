// Require Express :
const express = require("express");
const router = express.Router();

// Require Order Controller :
const {
    placeOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    cancelOrder
} = require("../../../Src/modules/order/Controller");

// Require Protect And Admin Middleware :
const { protect } = require("../../../Src/modules/auth/AuthMiddleware");
const { adminOnly } = require("../../../Src/modules/auth/AdminMiddleware");

// For Public :
router.post("/placeOrder", protect, placeOrder);
router.get("/my-orders", protect, getMyOrders);
router.delete("/cancel/:orderId", protect, cancelOrder);


// For Admin :
router.get("/getAllOrders", protect, adminOnly, getAllOrders);
router.patch("/status/:orderId", protect, adminOnly, updateOrderStatus);

// Export Module :
module.exports = router;