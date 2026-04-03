// Require Product And Category Model :
const Product = require("../../../Src/modules/product/Model");
const Category = require("../../../Src/modules/category/Model");

//Logic For  CREATE PRODUCT :
const createProductService = async (body) => {

  const { title, description, categoryId, images, variants, tags, isNewArrival } = body;

  if (!title || !categoryId) {
    throw new Error("Title and category required");
  }

  if (!variants || variants.length === 0) {
    throw new Error("At least one variant required");
  }

  const category = await Category.findById(categoryId);

  if (!category || !category.isActive) {
    throw new Error("Invalid category");
  }

  if (!category.parentCategory) {
    throw new Error("Product can only be added to child category");
  }

  const existing = await Product.findOne({ title, categoryId });

  if (existing) {
    throw new Error("Product already exists in this category");
  }

  let totalStock = 0;
  variants.forEach(v => totalStock += v.stock);

  const product = await Product.create({
    title,
    description,
    categoryId,
    images,
    variants,
    tags,
    isNewArrival,
    totalStock
  });

  return product;
};


// Logic For GET PRODUCTS :
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

  if (q) {
    filter.title = { $regex: q, $options: "i" };
  }

  if (categoryId) {
    filter.categoryId = categoryId;
  }

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
    .populate({
      path: "categoryId",
      select: "name parentCategory",
      populate: { path: "parentCategory", select: "name" }
    })
    .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(Number(limit));

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


//Logic For GET SINGLE PRODUCT :
const getSingleProductService = async (slug) => {

  const product = await Product.findOne({
    slug,
    isActive: true
  }).populate({
    path: "categoryId",
    select: "name parentCategory",
    populate: { path: "parentCategory", select: "name" }
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};


//Logic For UPDATE PRODUCT :
const updateProductService = async (id, body) => {

  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  const { title, description, categoryId, images, variants, tags, isNewArrival, isActive } = body;

  if (title) product.title = title;
  if (description) product.description = description;

  if (categoryId) {
    const category = await Category.findById(categoryId);
    if (!category || !category.isActive) {
      throw new Error("Invalid category");
    }
    product.categoryId = categoryId;
  }

  if (images) product.images = images;

  if (variants) {
    product.variants = variants;

    let totalStock = 0;
    variants.forEach(v => totalStock += v.stock);
    product.totalStock = totalStock;
  }

  if (tags) product.tags = tags;
  if (typeof isNewArrival !== "undefined") product.isNewArrival = isNewArrival;
  if (typeof isActive !== "undefined") product.isActive = isActive;

  await product.save();

  return product;
};


//Logic For UPDATE STOCK :
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

  let totalStock = 0;
  product.variants.forEach(v => totalStock += v.stock);
  product.totalStock = totalStock;

  await product.save();

  return product;
};


// SIMPLE LISTS
const getNewArrivalsService = async () => {
  return await Product.find({ isActive: true, isNewArrival: true })
    .sort("-createdAt")
    .limit(10);
};

const getBestSellingService = async () => {
  return await Product.find({ isActive: true })
    .sort("-totalSold")
    .limit(10);
};

const getTopRatedService = async () => {
  return await Product.find({ isActive: true })
    .sort("-averageRating")
    .limit(10);
};


// Logic For DEACTIVATE :
const deactivateProductService = async (id) => {

  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  product.isActive = false;
  await product.save();

  return true;
};


// EXPORT
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