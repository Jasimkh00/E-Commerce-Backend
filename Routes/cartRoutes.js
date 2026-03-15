// Require Express :
const express = require("express");
const router = express.Router();

// Get Cart Controller :
const {
    addToCart,
    updateCartItem,
    removeCartItem,
    getCart
} = require("../Controllers/cartController");

// Require Protect Middleware :
const { protect } = require("../Middlewares/authMiddleware");


// Add Cart:
router.post("/items", protect, addToCart);

// Update Cart :
router.put("/items/:itemId", protect, updateCartItem);

// Delete Cart :
router.delete("/items/:itemId", protect, removeCartItem);

// Get Cart :
router.get("/get", protect, getCart);


// Export Module :
module.exports = router;