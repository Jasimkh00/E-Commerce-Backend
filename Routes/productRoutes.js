const express = require("express");
const router = express.Router();

const productController = require("../Controllers/productController");
const { protect } = require("../Middlewares/authMiddleware");
const { adminOnly } = require('../Middlewares/adminMiddleware');


// For Public :
router.get("/getAllProducts", protect, productController.getProducts);
router.get("/getSingleProduct/:slug", protect, productController.getSingleProduct);


// For Admin :
router.post("/createProduct", protect, adminOnly, productController.createProduct);
router.put("/updateProduct/:id", protect, adminOnly, productController.updateProduct);
router.patch("/softdeleteProduct/:id", protect, adminOnly, productController.deleteProduct);



module.exports = router;