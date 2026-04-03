// Make Express Router :
const express = require("express");
const router = express.Router();

// Require Admin Dashboard Controller :
const {getAdminDashboard} = require("../../../Src/modules/adminDashboard/Controller");

// Require Protect And Admin Middleware :
const {protect} = require("../../../Src/modules/auth/AuthMiddleware");
const {adminOnly} = require("../../../Src/modules/auth/AdminMiddleware");

// Get Dashboard :
router.get("/dashboard",protect,adminOnly, getAdminDashboard);


// Export Module :
module.exports = router;