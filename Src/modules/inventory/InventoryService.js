// Require Product Model :
const Product = require("../../../Src/modules/product/Model");

// Require Email :
const { sendLowStockAlert } = require("../../../Src/Utils/emailStockAdmin");

//Logic For Get Dashboard :
const getInventoryDashboardService = async () => {

  const totalProducts = await Product.countDocuments();

  const lowProductStock = await Product.countDocuments({
    totalStock: { $lte: 5, $gt: 0 }
  });

  const outOfStock = await Product.countDocuments({
    totalStock: 0
  });

  const products = await Product.find();

  let lowVariants = 0;

  products.forEach(product => {
    product.variants.forEach(v => {
      if (v.stock <= product.lowStockAlert && v.stock > 0) {
        lowVariants++;
      }
    });
  });

  return {
    totalProducts,
    lowProductStock,
    lowVariants,
    outOfStock
  };
};


//Logic For Low Product Stock :
const getLowProductStockService = async () => {

  const products = await Product.find({
    totalStock: { $lte: 5, $gt: 0 },
  });

  if (products.length > 0) {
    const adminEmail = process.env.ADMIN_EMAIL;
    await sendLowStockAlert(adminEmail, products);
  }

  return products;
};


//Logci For  Low Variant Stock :
const getLowVariantStockService = async () => {

  const products = await Product.find();
  let lowVariants = [];

  products.forEach(product => {
    product.variants.forEach(variant => {
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

  if (lowVariants.length > 0) {
    const adminEmail = process.env.ADMIN_EMAIL;
    await sendLowStockAlert(adminEmail, lowVariants);
  }

  return lowVariants;
};


//Logci For Out Of Stock :
const getOutOfStockService = async () => {

  const products = await Product.find({
    totalStock: 0
  });

  return products;
};


// Logci For Full Inventory :
const getFullInventoryService = async () => {

  const products = await Product.find()
    .select("title totalStock variants totalSold");

  return {
    total: products.length,
    products
  };
};


// Export Module :
module.exports = {
  getInventoryDashboardService,
  getLowProductStockService,
  getLowVariantStockService,
  getOutOfStockService,
  getFullInventoryService
};