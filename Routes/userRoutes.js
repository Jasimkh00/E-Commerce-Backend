const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");
const { protect } = require("../Middlewares/authMiddleware");
const {adminOnly} = require("../Middlewares/adminMiddleware");

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

module.exports = router;