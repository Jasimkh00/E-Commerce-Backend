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
} = require("../Controllers/orderController");

// Require Protect And Admin Middleware :
const { protect } = require("../Middlewares/authMiddleware");
const { adminOnly } = require("../Middlewares/adminMiddleware");

// For Public :
router.post("/placeOrder", protect, placeOrder);
router.get("/my-orders", protect, getMyOrders);
router.patch("/:orderId/cancel", protect, cancelOrder);


// For Admin :
router.get("/getAllOrders", protect, adminOnly, getAllOrders);
router.patch("/:orderId/status", protect, adminOnly, updateOrderStatus);

// Export Module :
module.exports = router;