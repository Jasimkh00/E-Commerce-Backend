const express = require("express");
const router = express.Router();

const categoryController = require('../Controllers/categoryController');
const { protect } = require('../Middlewares/authMiddleware');
const { adminOnly } = require('../Middlewares/adminMiddleware');

// For Public :
router.get("/getAllCategories",protect, categoryController.getCategories);

// For Admin :
router.post("/createCategory", protect,adminOnly, categoryController.createCategory);
router.put("/updateCategory/:id", protect,adminOnly, categoryController.updateCategory);
router.patch("/softDeleteCategory/:id", protect,adminOnly, categoryController.deleteCategory);



module.exports = router;