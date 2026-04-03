// Require Express :
const express = require("express");
const router = express.Router();

// Require Category Controller :
const categoryController = require('../../../Src/modules/category/Controller');

// Require Protect And Admin  Middleware :
const { protect } = require('../../../Src/modules/auth/AuthMiddleware');
const { adminOnly } = require('../../../Src/modules/auth/AdminMiddleware');

// For Public :
router.get("/getAllCategories",protect, categoryController.getCategories);
router.get("/getSingle/:id",protect,categoryController.getCategoryById);

// For Admin :
router.post("/createCategory", protect,adminOnly, categoryController.createCategory);
router.put("/updateCategory/:id", protect,adminOnly, categoryController.updateCategory);
router.patch("/DeactivateCategory/:id", protect,adminOnly, categoryController.deactivateCategory);

// Export Module :
module.exports = router;