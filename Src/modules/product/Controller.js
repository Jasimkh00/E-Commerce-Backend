// Require Product Service :
const service = require("../../../Src/modules/product/ProductService");

// CREATE
exports.createProduct = async (req, res) => {
  try {
    const body = req.body || {};
    const files = req.files || [];

    console.log("REQ BODY:", body);      // ✅ Debug body
    console.log("REQ FILES:", files);    // ✅ Debug files

    const product = await service.createProductService(body, files);

    res.status(201).json({
      success: true,
      product
    });
  } catch (err) {
    console.error("🔥 CREATE PRODUCT ERROR:", err); // ✅ Full error in console
    res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack
    });
  }
};

// GET ALL
exports.getProducts = async (req, res) => {
  try {
    const result = await service.getProductsService(req.query);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// SINGLE
exports.getSingleProduct = async (req, res) => {
  try {
    const data = await service.getSingleProductService(req.params.slug);
    res.status(200).json({ data });
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

// UPDATE
exports.updateProduct = async (req, res) => {
  try {
    const data = await service.updateProductService(req.params.id, req.body);
    res.status(200).json({ message: "Updated", data });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// STOCK
exports.updateProductStock = async (req, res) => {
  try {
    const data = await service.updateProductStockService(req.params.id, req.body);
    res.status(200).json({ message: "Stock updated", data });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// NEW ARRIVALS
exports.getNewArrivals = async (req, res) => {
  try {
    const data = await service.getNewArrivalsService();
    res.status(200).json({ data });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// BEST SELLING
exports.getBestSelling = async (req, res) => {
  try {
    const data = await service.getBestSellingService();
    res.status(200).json({ data });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// TOP RATED
exports.getTopRated = async (req, res) => {
  try {
    const data = await service.getTopRatedService();
    res.status(200).json({ data });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// DEACTIVATE
exports.deactivateProduct = async (req, res) => {
  try {
    await service.deactivateProductService(req.params.id);
    res.status(200).json({ message: "Deactivated" });
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

