// Requiure Product And Catgeory Model :
const Product = require("../../../Src/modules/product/Model");
const Category = require("../../../Src/modules/category/Model");

// Logic For CREATE PRODUCT :
const createProductService = async (body) => {
  const { title, description, categoryId, images, variants, tags, isNewArrival } = body;

  if (!title || !categoryId) throw new Error("Title and category required");
  if (!variants?.length) throw new Error("At least one variant required");

  const category = await Category.findById(categoryId).lean();
  if (!category || !category.isActive) throw new Error("Invalid category");
  if (!category.parentCategory) throw new Error("Product can only be added to child category");

  const exists = await Product.exists({ title, categoryId });
  if (exists) throw new Error("Product already exists in this category");

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


// Logic For GET ALL PRODUCTS :
const getProductsService = async (query) => {
  const {
    categoryId,
    minPrice,
    maxPrice,
    q,
    inStock,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = query;

  let filter = { isActive: true };

  if (q) filter.title = { $regex: q, $options: "i" };
  if (categoryId) filter.categoryId = categoryId;

  if (minPrice || maxPrice) {
    filter["variants.price"] = {};
    if (minPrice) filter["variants.price"].$gte = Number(minPrice);
    if (maxPrice) filter["variants.price"].$lte = Number(maxPrice);
  }

  if (inStock === "true") {
    filter["variants.stock"] = { $gt: 0 };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const products = await Product.find(filter)
    .select("title images totalStock categoryId createdAt variants") // ✅ FIXED
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


// Logic For GET SINGLE PRODUCT:
const getSingleProductService = async (slug) => {
  const product = await Product.findOne({ slug, isActive: true })
    .populate("categoryId", "name")
    .lean();

  if (!product) throw new Error("Product not found");

  return product;
};


//Logic For UPDATE PRODUCT :
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


// Logic For UPDATE STOCK :
const updateProductStockService = async (id, body) => {
  const { variantId, stock } = body;

  if (!variantId || stock === undefined) {
    throw new Error("variantId and stock are required");
  }

  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  const variant = product.variants.id(variantId);
  if (!variant) throw new Error("Variant not found");

  variant.stock = stock;

  product.totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  await product.save();
  return product;
};


// Logic For NEW ARRIVALS :
const getNewArrivalsService = async () => {
  return await Product.find({ isActive: true, isNewArrival: true })
    .sort("-createdAt")
    .limit(10)
    .lean();
};


// Logci For BEST SELLING :
const getBestSellingService = async () => {
  return await Product.find({ isActive: true })
    .sort("-totalSold")
    .limit(10)
    .lean();
};


// Logic For TOP RATED :
const getTopRatedService = async () => {
  return await Product.find({ isActive: true })
    .sort("-averageRating")
    .limit(10)
    .lean();
};


// Logic For DEACTIVATE PRODUCT :
const deactivateProductService = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  product.isActive = false;
  await product.save();

  return true;
};

// Export Moduels :
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