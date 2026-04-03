// Require Product Service :
const productService = require("../../../Src/modules/product/ProductService");

// CREATE
const createProduct = async (req, res) => {
  try {
    const product = await productService.createProductService(req.body);

    res.status(201).json({
      message: "Product created successfully",
      data: product
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// GET ALL
const getProducts = async (req, res) => {
  try {
    const result = await productService.getProductsService(req.query);

    res.status(200).json({
      message: "Products fetched",
      data: result.products,
      meta: result.meta
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET SINGLE
const getSingleProduct = async (req, res) => {
  try {
    const product = await productService.getSingleProductService(req.params.slug);

    res.status(200).json({
      message: "Product fetched",
      data: product
    });

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


// UPDATE
const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProductService(req.params.id, req.body);

    res.status(200).json({
      message: "Product updated successfully",
      data: product
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// UPDATE STOCK
const updateProductStock = async (req, res) => {
  try {
    const product = await productService.updateProductStockService(req.params.id, req.body);

    res.status(200).json({
      message: "Stock updated successfully",
      data: product
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// LIST APIs
const getNewArrivals = async (req, res) => {
  try {
    const data = await productService.getNewArrivalsService();

    res.status(200).json({
      message: "New arrivals",
      data
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBestSelling = async (req, res) => {
  try {
    const data = await productService.getBestSellingService();

    res.status(200).json({
      message: "Best selling products",
      data
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTopRated = async (req, res) => {
  try {
    const data = await productService.getTopRatedService();

    res.status(200).json({
      message: "Top rated products",
      data
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DEACTIVATE
const deactivateProduct = async (req, res) => {
  try {
    await productService.deactivateProductService(req.params.id);

    res.status(200).json({
      message: "Product deactivated successfully"
    });

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


// EXPORT
module.exports = {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  updateProductStock,
  getNewArrivals,
  getBestSelling,
  getTopRated,
  deactivateProduct
};