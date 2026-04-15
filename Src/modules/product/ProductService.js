const Product = require("../../../Src/modules/product/Model");
const Category = require("../../../Src/modules/category/Model");

// CREATE PRODUCT
const createProductService = async (body = {}, files = []) => {
  let { title, description, categoryId, variants, tags, isNewArrival } = body;

  if (!title || !categoryId) {
    throw new Error("Title and category required");
  }

  // Parse variants
  if (typeof variants === "string") {
    try {
      variants = JSON.parse(variants);
    } catch (e) {
      throw new Error("Variants must be valid JSON");
    }
  }

  if (!Array.isArray(variants) || variants.length === 0) {
    throw new Error("At least one variant required");
  }

  variants = variants.map((v) => ({
    color: v.color || "",
    size: v.size || "",
    price: Number(v.price) || 0,
    discountType: v.discountType || null,
    discountValue: Number(v.discountValue) || 0,
    stock: Number(v.stock) || 0
  }));

  if (typeof tags === "string") {
    tags = tags.split(",").map(t => t.trim());
  } else {
    tags = [];
  }

  isNewArrival = isNewArrival === "true" || isNewArrival === true;

  const category = await Category.findById(categoryId);
  if (!category) throw new Error("Invalid category");

  const baseUrl = process.env.BASE_URL || "";

  const images = files.length > 0
    ? files.map(f => `${baseUrl}/uploads/${f.filename}`)
    : [];

  return await Product.create({
    title,
    description,
    categoryId,
    images,
    variants,
    tags,
    isNewArrival
  });
};

// GET ALL PRODUCTS
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
    .select("title images totalStock categoryId createdAt variants")
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
      totalPages: Math.ceil(total / Number(limit))
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
const updateProductService = async (id, body, files = []) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  if (body.variants && typeof body.variants === "string") {
    try {
      body.variants = JSON.parse(body.variants);
    } catch (e) {
      throw new Error("Variants must be valid JSON");
    }
  }

  if (files.length > 0) {
    const baseUrl = process.env.BASE_URL || "";
    body.images = files.map(f => `${baseUrl}/uploads/${f.filename}`);
  }

  Object.assign(product, body);

  await product.save();
  return product;
};

// UPDATE STOCK
const updateProductStockService = async (id, body) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  const variant = product.variants.id(body.variantId);
  if (!variant) throw new Error("Variant not found");

  variant.stock = Number(body.stock) || 0;

  product.totalStock = product.variants.reduce(
    (sum, v) => sum + (Number(v.stock) || 0),
    0
  );

  await product.save();
  return product;
};

// Get New Arrivals :
const getNewArrivalsService = async () => {
  return await Product.find({ isActive: true, isNewArrival: true })
    .sort("-createdAt")
    .limit(10)
    .lean();
};

// Best Selling Products :
const getBestSellingService = async () => {
  return await Product.find({
    isActive: true,
    totalSold: { $gt: 0 } 
  })
    .sort({ totalSold: -1 })
    .limit(10)
    .lean();
};

// To Rated Products :
const getTopRatedService = async () => {
  return await Product.find({
    isActive: true,
    averageRating: { $gte: 3 } 
  })
    .sort({ averageRating: -1 })
    .limit(10)
    .lean();
};

// Deactivate :
const deactivateProductService = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  product.isActive = false;
  await product.save();
  return true;
};


// DELETE PRODUCT :
const deleteProductService = async (id) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  await Product.findByIdAndDelete(id);

  return true;
};

// Export Module :
module.exports = {
  createProductService,
  getProductsService,
  getSingleProductService,
  updateProductService,
  updateProductStockService,
  getNewArrivalsService,
  getBestSellingService,
  getTopRatedService,
  deactivateProductService,
  deleteProductService
};