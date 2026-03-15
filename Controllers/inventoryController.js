// Require Product Model :
const Product = require("../Models/productModel");

// Require Email Stock Admin :
const { sendLowStockAlert } = require("../Utils/emailStockAdmin");

//  Logic For Inventory Dashboard :
const getInventoryDashboard = async (req, res) => {

  // Using Try-Catch :
  try {

    const totalProducts = await Product.countDocuments()

    const lowProductStock = await Product.countDocuments({
      totalStock: { $lte: 5, $gt: 0 }
    });

    const outOfStock = await Product.countDocuments({
      totalStock: 0
    });

    //  Find Products :
    const products = await Product.find()

    let lowVariants = 0

    products.forEach(product => {
      product.variants.forEach(v => {
        if (v.stock <= product.lowStockAlert && v.stock > 0) {
          lowVariants++
        }

      });

    });

    //  Response :
    res.status(200).json({
      message: "Inventory dashboard",
      data: {
        totalProducts,
        lowProductStock,
        lowVariants,
        outOfStock
      }

    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};


// Logic For Low Product Stock :
const getLowProductStock = async (req, res) => {

  // Using Try-Catch :
  try {
    const products = await Product.find({
      totalStock: { $lte: 5, $gt: 0 },
    });

    // Send email for low product stock
    if (products.length > 0) {
      const adminEmail = process.env.ADMIN_EMAIL;
      await sendLowStockAlert(adminEmail, products);
    }

    // Response :
    res.status(200).json({
      message: "Low product stock",
      data: products,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

// Logic For Low Variant Stock API :
const getLowVariantStock = async (req, res) => {

  // Using Try-Catch :
  try {
    const products = await Product.find();
    let lowVariants = [];

    products.forEach((product) => {
      product.variants.forEach((variant) => {
        if (variant.stock <= product.lowStockAlert && variant.stock > 0) {
          lowVariants.push({
            productId: product._id,
            productTitle: product.title,
            variantId: variant._id,
            size: variant.size,
            color: variant.color,
            stock: variant.stock,
          });
        }
      });
    });

    // If low stock variants are found, send email to admin :
    if (lowVariants.length > 0) {
      const adminEmail = process.env.ADMIN_EMAIL;
      await sendLowStockAlert(adminEmail, lowVariants);
    }

    // Response :
    res.status(200).json({
      message: "Low variant stock",
      total: lowVariants.length,
      data: lowVariants,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

// Logic For Out Of Stock Products :
const getOutOfStock = async (req, res) => {

  // Using Try-catch :
  try {

    const products = await Product.find({
      totalStock: 0
    });

    //  Response :
    res.status(200).json({
      message: "Out of stock products",
      data: products
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

// Logic For Inventory Full List :
const getFullInventory = async (req, res) => {

  // Using Try-Catch :
  try {

    const products = await Product.find()
      .select("title totalStock variants totalSold")

    //  Response :
    res.status(200).json({
      message: "Full inventory",
      total: products.length,
      data: products

    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

// EXPORT MODULE :
module.exports = {
  getInventoryDashboard,
  getLowProductStock,
  getLowVariantStock,
  getOutOfStock,
  getFullInventory
};