// Require Express :
const express = require("express");
const router = express.Router();

// Require Sale Controller :
const {
 createSale,
 updateSale,
 getActiveSales,
 deleteSale
} = require("../Controllers/saleController");

// Require Protect And Admin Middleware :
const {protect} = require("../Middlewares/authMiddleware");
const {adminOnly} = require("../Middlewares/adminMiddleware");

// Create Sale (For Admin):
router.post("/CreateSale",protect,adminOnly,createSale);

// Update Sale (For Admin):
router.put("/update/:id",protect,adminOnly,updateSale);

// Get Sale (For Public):
router.get("/active",protect,getActiveSales);

// Delete Sale (For Admin) :
router.delete("/delete/:id",protect,adminOnly,deleteSale);

// Export Module :
module.exports = router;