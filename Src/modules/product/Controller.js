const service = require("../../../Src/modules/product/ProductService");

// CREATE
exports.createProduct = async (req, res) => {
  try {
    const data = await service.createProductService(req.body);
    res.status(201).json({ message: "Product created", data });
  } catch (e) {
    res.status(400).json({ message: e.message });
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

// LISTS
exports.getNewArrivals = async (req, res) => {
  const data = await service.getNewArrivalsService();
  res.json({ data });
};

exports.getBestSelling = async (req, res) => {
  const data = await service.getBestSellingService();
  res.json({ data });
};

exports.getTopRated = async (req, res) => {
  const data = await service.getTopRatedService();
  res.json({ data });
};

// DEACTIVATE
exports.deactivateProduct = async (req, res) => {
  try {
    await service.deactivateProductService(req.params.id);
    res.json({ message: "Deactivated" });
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};