// Require Express :
const express = require("express");
const router = express.Router();

// Require Slider Controller :
const {
    createSlider,
    getSliders,
    updateSlider,
    deleteSlider
} = require("../Controllers/sliderController");

// Require Protect And Admin  Middleware :
const { protect } = require('../Middlewares/authMiddleware');
const { adminOnly } = require('../Middlewares/adminMiddleware');

// For Admin :
router.post("/create", protect, adminOnly, createSlider);
router.put("update/:id", protect, adminOnly, updateSlider);
router.delete("/delete/:id", protect, adminOnly, deleteSlider);

// For Public (Home-Page) :
router.get("/get", getSliders);


// Export Module :
module.exports = router;