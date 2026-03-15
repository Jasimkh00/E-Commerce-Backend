// Make Express Router :
const express = require("express");
const router = express.Router();

// Require Admin Dashboard Controller :
const {getAdminDashboard} = require("../Controllers/adminDashboardController");

// Require Protect And Admin Middleware :
const {protect} = require("../Middlewares/authMiddleware");
const {adminOnly} = require("../Middlewares/adminMiddleware");

// Get Dashboard :
router.get("/dashboard",protect,adminOnly, getAdminDashboard);


// Export Module :
module.exports = router;