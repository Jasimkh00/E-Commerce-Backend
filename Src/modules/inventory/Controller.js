// Require Inventory Service :
const inventoryService = require("../../../Src/modules/inventory/InventoryService");

// Dashboard
const getInventoryDashboard = async (req, res) => {
  try {

    const data = await inventoryService.getInventoryDashboardService();

    res.status(200).json({
      message: "Inventory dashboard",
      data
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Low Product Stock
const getLowProductStock = async (req, res) => {
  try {

    const products = await inventoryService.getLowProductStockService();

    res.status(200).json({
      message: "Low product stock",
      data: products
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Low Variant Stock
const getLowVariantStock = async (req, res) => {
  try {

    const variants = await inventoryService.getLowVariantStockService();

    res.status(200).json({
      message: "Low variant stock",
      total: variants.length,
      data: variants
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Out Of Stock
const getOutOfStock = async (req, res) => {
  try {

    const products = await inventoryService.getOutOfStockService();

    res.status(200).json({
      message: "Out of stock products",
      data: products
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Full Inventory
const getFullInventory = async (req, res) => {
  try {

    const result = await inventoryService.getFullInventoryService();

    res.status(200).json({
      message: "Full inventory",
      total: result.total,
      data: result.products
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// EXPORT
module.exports = {
  getInventoryDashboard,
  getLowProductStock,
  getLowVariantStock,
  getOutOfStock,
  getFullInventory
};