// Require Express :
const express = require("express");
const router = express.Router();

// Require Inventory Controller :
const{
 getInventoryDashboard,
 getLowProductStock,
 getLowVariantStock,
 getOutOfStock,
 getFullInventory
}=require("../Controllers/inventoryController");

// Require Project And Admin Middleware :
const {protect} = require("../Middlewares/authMiddleware");
const {adminOnly} = require("../Middlewares/adminMiddleware");

// Get Inventory Dashboard :
router.get("/getinventory",protect,adminOnly,getInventoryDashboard);

// Get Low Product Stock Alert :
router.get("/low-products",protect,adminOnly,getLowProductStock);

// Get Low Varients Stock Alert :
router.get("/low-variants",protect,adminOnly,getLowVariantStock);

// Get Out Of Stock :
router.get("/out-of-stock",protect,adminOnly,getOutOfStock);

// Get Full Inventory :
router.get("/all",protect,adminOnly,getFullInventory);

// Export Module :
module.exports=router;