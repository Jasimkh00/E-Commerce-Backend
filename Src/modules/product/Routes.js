// Require Express :
const express = require("express");
const router = express.Router();

// Require Product Controller :
const productController = require("../../../Src/modules/product/Controller");

// Require Protect And Admin Middleware :
const { protect } = require("../../../Src/modules/auth/AuthMiddleware");
const { adminOnly } = require('../../../Src/modules/auth/AdminMiddleware');


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
router.patch("/updateProductStock/:varientid",protect,adminOnly,productController.updateProductStock);


// Export Module :
module.exports = router;