// Require Express :
const express = require("express");
const router = express.Router();

// Require Review Controller :
const {
    addReview,
    getProductReviews,
    deleteReview
} = require("../Controllers/reviewController");

// Require Protect Middleware :
const {protect} = require("../Middlewares/authMiddleware");

// Add Review (For Public):
router.post("/addReview", protect,addReview);

// Get Product Reviews (For Public): 
router.get("/getReviews/:productId", protect,getProductReviews);

// Delete Reviews (For Public):
router.delete("/deleteReview/:id", protect,deleteReview);


// Export Module :
module.exports = router;