// Require Express :
const express = require("express");
const router = express.Router();

// Require Slider Controller :
const {
    createSlider,
    getSliders,
    updateSlider,
    deleteSlider
} = require("../../../Src/modules/slider/Controller");

// Require Protect And Admin  Middleware :
const { protect } = require('../../../Src/modules/auth/AuthMiddleware');
const { adminOnly } = require('../../../Src/modules/auth/AdminMiddleware');

// For Admin :
router.post("/create", protect, adminOnly, createSlider);
router.put("/update/:id", protect, adminOnly, updateSlider);
router.delete("/delete/:id", protect, adminOnly, deleteSlider);

// For Public (Home-Page) :
router.get("/get", getSliders);


// Export Module :
module.exports = router;