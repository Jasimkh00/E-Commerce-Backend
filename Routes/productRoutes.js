// Require Express :
const express = require("express");
const router = express.Router();

// Require Product Controller :
const productController = require("../Controllers/productController");

// Require Protect And Admin Middleware :
const { protect } = require("../Middlewares/authMiddleware");
const { adminOnly } = require('../Middlewares/adminMiddleware');


// For Public :
router.get("/getAllProducts", protect, productController.getProducts);
router.get("/getSingleProduct/:slug", protect, productController.getSingleProduct);
router.get("/new-arrivals",protect,productController.getNewArrivals);
router.get("/best-selling",protect,productController.getBestSelling);
router.get("/top-rated",protect,productController.getTopRated);


// For Admin :
router.post("/createProduct", protect, adminOnly, productController.createProduct);
router.put("/updateProduct/:id", protect, adminOnly, productController.updateProduct);
router.patch("/deactivateProduct/:id", protect, adminOnly, productController.deactivateProduct);


// Export Module :
module.exports = router;