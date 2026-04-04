// Require Product And Category Models :
const Product = require("../../../Src/modules/product/Model");
const Category = require("../../../Src/modules/category/Model");

// CREATE PRODUCT
const createProductService = async (body) => {
  const { title, description, categoryId, images, variants, tags, isNewArrival } = body;

  if (!title || !categoryId) throw new Error("Title and category required");
  if (!variants?.length) throw new Error("At least one variant required");

  const category = await Category.findById(categoryId).lean();
  if (!category) throw new Error("Invalid category");

  const exists = await Product.exists({ title, categoryId });
  if (exists) throw new Error("Product already exists");

  const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

  return await Product.create({
    title,
    description,
    categoryId,
    images,
    variants,
    tags,
    isNewArrival,
    totalStock
  });
};


// GET ALL PRODUCTS (✅ VARIANTS FIXED)
const getProductsService = async (query) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    categoryId,
    q,
    inStock
  } = query;

  let filter = { isActive: true };

  if (q) filter.title = { $regex: q, $options: "i" };
  if (categoryId) filter.categoryId = categoryId;
  if (inStock === "true") filter["variants.stock"] = { $gt: 0 };

  const skip = (page - 1) * limit;

  const products = await Product.find(filter)
    .select("title images totalStock categoryId createdAt variants") // ✅ FIX
    .populate("categoryId", "name")
    .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const total = await Product.countDocuments(filter);

  return {
    products,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};


// SINGLE PRODUCT
const getSingleProductService = async (slug) => {
  const product = await Product.findOne({ slug, isActive: true })
    .populate("categoryId", "name")
    .lean();

  if (!product) throw new Error("Product not found");

  return product;
};


// UPDATE PRODUCT
const updateProductService = async (id, body) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  Object.assign(product, body);

  if (body.variants) {
    product.totalStock = body.variants.reduce((sum, v) => sum + v.stock, 0);
  }

  await product.save();
  return product;
};


// UPDATE STOCK
const updateProductStockService = async (id, body) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  const variant = product.variants.id(body.variantId);
  if (!variant) throw new Error("Variant not found");

  variant.stock = body.stock;

  product.totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  await product.save();
  return product;
};


// NEW ARRIVALS
const getNewArrivalsService = async () => {
  return await Product.find({ isActive: true, isNewArrival: true })
    .sort("-createdAt")
    .limit(10)
    .lean();
};


// BEST SELLING
const getBestSellingService = async () => {
  return await Product.find({ isActive: true })
    .sort("-totalSold")
    .limit(10)
    .lean();
};


// TOP RATED
const getTopRatedService = async () => {
  return await Product.find({ isActive: true })
    .sort("-averageRating")
    .limit(10)
    .lean();
};


// DEACTIVATE
const deactivateProductService = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  product.isActive = false;
  await product.save();
  return true;
};

// Export Modules :
module.exports = {
  createProductService,
  getProductsService,
  getSingleProductService,
  updateProductService,
  updateProductStockService,
  getNewArrivalsService,
  getBestSellingService,
  getTopRatedService,
  deactivateProductService
};