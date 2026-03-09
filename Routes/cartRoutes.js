const express = require("express");
const router = express.Router();

const cartController = require("../Controllers/cartController");
const { protect } = require("../Middlewares/authMiddleware");

// For Public :
router.post("/addCart", protect, cartController.addToCart);
router.get("/getCart", protect, cartController.getCart);
router.put("/updateCart/:itemId", protect, cartController.updateCartItem);
router.delete("/deleteCart/:itemId", protect, cartController.removeCartItem);

module.exports = router;