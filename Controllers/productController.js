const Product = require("../Models/productModel");
const Category = require("../Models/categoryModel");

// Logic For Create Product (For Admin) :
const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      categoryId,
      price,
      discountType,
      discountValue = 0,
      stockTotal,
      tags,
      images,
      isNewArrival,
    } = req.body;

    if (!title || !description || !categoryId || !price || stockTotal === undefined) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const category = await Category.findById(categoryId);
    if (!category || !category.isActive) {
      return res.status(400).json({ message: "Invalid or inactive category" });
    }

    const existing = await Product.findOne({ title });
    if (existing) {
      return res.status(400).json({ message: "Product already exists" });
    }

    if (discountType === "percent" && discountValue > 100) {
      return res.status(400).json({ message: "Invalid discount percent" });
    }

    const product = await Product.create({
      title,
      description,
      categoryId,
      price,
      discountType,
      discountValue,
      stockTotal,
      tags,
      images,
      isNewArrival,
    });

    res.status(201).json({
      message: "Product created successfully",
      data: product,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Logic For Get All Products (For Public) :
const getProducts = async (req, res) => {
  try {
    let {
      q,
      categoryId,
      minPrice,
      maxPrice,
      inStock,
      isNewArrival,
      hasDiscount,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const filter = { isActive: true };

    if (categoryId) filter.categoryId = categoryId;

    if (minPrice || maxPrice) {
      filter.finalPrice = {};
      if (minPrice) filter.finalPrice.$gte = Number(minPrice);
      if (maxPrice) filter.finalPrice.$lte = Number(maxPrice);
    }

    if (inStock === "true") filter.stockTotal = { $gt: 0 };
    if (isNewArrival === "true") filter.isNewArrival = true;
    if (hasDiscount === "true") filter.discountType = { $ne: null };

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ];
    }

    const allowedSortFields = ["price", "createdAt", "finalPrice"];
    if (!allowedSortFields.includes(sortBy)) {
      sortBy = "createdAt";
    }

    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const products = await Product.find(filter)
      .select("-stockTotal")
      .sort(sort)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      message: "Products fetched",
      data: products,
      meta: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Logic For Get Single Product (For Public):
const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    }).select("-stockTotal");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product fetched",
      data: product,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logic For Update Product (For Admin):
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      title,
      description,
      categoryId,
      price,
      discountType,
      discountValue,
      stockTotal,
      tags,
      images,
      isNewArrival,
      isActive,
    } = req.body;

    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category || !category.isActive) {
        return res.status(400).json({ message: "Invalid category" });
      }
      product.categoryId = categoryId;
    }

    if (title) product.title = title;
    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (discountType !== undefined) product.discountType = discountType;
    if (discountValue !== undefined) product.discountValue = discountValue;
    if (stockTotal !== undefined) product.stockTotal = stockTotal;
    if (tags) product.tags = tags;
    if (images) product.images = images;
    if (typeof isNewArrival !== "undefined") product.isNewArrival = isNewArrival;
    if (typeof isActive !== "undefined") product.isActive = isActive;

    await product.save(); // pre-save hook will recalc finalPrice

    res.status(200).json({
      message: "Product updated successfully",
      data: product,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logic For Soft Delete Product (For Admin) :
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isActive = false;
    await product.save();

    res.status(200).json({
      message: "Product deactivated successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};