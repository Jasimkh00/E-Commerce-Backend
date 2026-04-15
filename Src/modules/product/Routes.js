const express = require("express");
const router = express.Router();

const uploads = require("../../../Src/uploads/multer");
const productController = require("../../../Src/modules/product/Controller");
const { protect } = require("../../../Src/modules/auth/AuthMiddleware");
const { adminOnly } = require("../../../Src/modules/auth/AdminMiddleware");

// Public
router.get("/getAllProducts", protect, productController.getProducts);
router.get("/getSingleProduct/:slug", protect, productController.getSingleProduct);
router.get("/new-arrivals", protect, productController.getNewArrivals);
router.get("/best-selling", protect, productController.getBestSelling);
router.get("/top-rated", protect, productController.getTopRated);

// Admin
router.post(
  "/createProduct",
  protect,
  adminOnly,
  uploads.array("images", 5), // Multer middleware
  productController.createProduct
);

router.put(
  "/updateProduct/:id",
  protect,
  adminOnly,
  uploads.array("images", 5),
  productController.updateProduct
);

router.patch("/deactivateProduct/:id", protect, adminOnly, productController.deactivateProduct);
router.patch("/updateProductStock/:id", protect, adminOnly, productController.updateProductStock);
router.delete("/deleteProduct/:id", protect, adminOnly, productController.deleteProduct);

// Export Module :
module.exports = router;
