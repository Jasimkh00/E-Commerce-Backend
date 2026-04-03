// Require Express :
const express = require("express");
const router = express.Router();

// Require Auth Controller :
const authController = require("../../../Src/modules/auth/Controller");

// Require Protect And Admin Routes :
const { protect } = require("../../../Src/modules/auth/AuthMiddleware");
const {adminOnly} = require("../../../Src/modules/auth/AdminMiddleware");


// For Public :
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/getProfile", protect, authController.getProfile);
router.post("/forgot-password", authController.forgetPassword);
router.post("/reset-password/:token", authController.resetPassword);

// For Admin :
router.get("/getAllusers", protect,adminOnly, authController.getAllUsers);
router.patch('/softDelete/:id',protect,adminOnly,authController.softDelete);
router.delete('/delete/:id',protect,adminOnly,authController.deleteUserPermanent);


// Export Module :
module.exports = router;