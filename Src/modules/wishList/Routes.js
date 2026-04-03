// Require Express :
const express = require("express");
const router = express.Router();

// Require WishList Controller :
const {
    addToWishlist,
    removeFromWishlist,
    getWishlist
} = require("../../../Src/modules/wishList/Controller");

// Require Protect Middleware :
const { protect } = require("../../../Src/modules/auth/AuthMiddleware");

// Add To WishList (For Public):
router.post("/addToWish", protect, addToWishlist);

// Remove From WishList (For Public):
router.delete("/removeFromWish/:productId", protect, removeFromWishlist);

// Get WishLists (For Public):
router.get("/getWishList", protect, getWishlist);

// Export Module :
module.exports = router;