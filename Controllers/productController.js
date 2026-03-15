// Require Model :
const Product = require("../Models/productModel");
const Category = require("../Models/categoryModel");

// Logic For Create Product :
const createProduct = async (req, res) => {

  // Using Try-Catch :
  try {

    // Get Data From Body :
    const {
      title,
      description,
      categoryId,
      images,
      variants,
      tags,
      isNewArrival
    } = req.body;


    // Using If :
    if (!title || !categoryId) {
      return res.status(400).json({
        message: "Title and category required"
      })
    }

    if (!variants || variants.length === 0) {
      return res.status(400).json({
        message: "At least one variant required"
      })
    }

    // Find Category By Id :
    const category = await Category.findById(categoryId);

    if (!category || !category.isActive) {
      return res.status(400).json({
        message: "Invalid category"
      });
    }

    // Product Can Only Store In Child Category :
    if (!category.parentCategory) {
      return res.status(400).json({
        message: "Product can only be added to child category"
      });
    }

    const existing = await Product.findOne({
      title,
      categoryId
    });

    if (existing) {
      return res.status(400).json({
        message: "Product already exists in this category"
      });
    };

    //  Calculate Total Stock :
    let totalStock = 0;

    variants.forEach(v => {
      totalStock += v.stock;
    });

    // Create Product :
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

    // Response :
    res.status(201).json({
      message: "Product created successfully",
      data: product
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logic For Get All Products (With Filters)
const getProducts = async (req, res) => {

  // Using Try-Catch :
  try {

    // Get Filters From Query :
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
    } = req.query;

    let filter = { isActive: true };

    // Search Filter
    if (q) {
      filter.title = {
        $regex: q,
        $options: "i"
      };
    }

    // Category Filter
    if (categoryId) {
      filter.categoryId = categoryId;
    }

    // Price Filter (variants price)
    if (minPrice || maxPrice) {
      filter["variants.price"] = {};

      if (minPrice) {
        filter["variants.price"].$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter["variants.price"].$lte = Number(maxPrice);
      }
    }

    // Stock Filter
    if (inStock === "true") {
      filter["variants.stock"] = { $gt: 0 };
    }

   const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter)
      .populate({
        path: "categoryId",
        select: "name parentCategory",
        populate: {
          path: "parentCategory",
          select: "name"
        }
      })
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    // Response :
    res.status(200).json({
      message: "Products fetched",
      data: products,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logic For Get Single Product :
const getSingleProduct = async (req, res) => {

  // Using Try-Catch :
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true
    })
      // Populate Child Category Then Populate Parent Category :
      .populate({
        path: "categoryId",
        select: "name parentCategory",
        populate: {
          path: "parentCategory",
          select: "name"
        }
      });

      // Using If :
    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    // Response :
    res.status(200).json({
      message: "Product fetched",
      data: product
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logic for Update Product :
const updateProduct = async (req, res) => {

  // Using Try-Catch :
  try {

    // Find Product By Id:
    const product = await Product.findById(req.params.id);

    // Using If :
    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    // Get Data From Body :
    const {
      title,
      description,
      categoryId,
      images,
      variants,
      tags,
      isNewArrival,
      isActive
    } = req.body;

    // Updates And Save Using If :
    if (title) product.title = title;

    if (description) product.description = description;

    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category || !category.isActive) {
        return res.status(400).json({
          message: "Invalid category"
        });
      }

      product.categoryId = categoryId;

    };

    if (images) product.images = images;

    // In Varients Check Stock :
    if (variants) {

      product.variants = variants;

      let totalStock = 0;

      variants.forEach(v => {
        totalStock += v.stock;
      });

      product.totalStock = totalStock;

    };

    if (tags) product.tags = tags;

    if (typeof isNewArrival !== "undefined") {
      product.isNewArrival = isNewArrival;
    };

    if (typeof isActive !== "undefined") {
      product.isActive = isActive;
    };

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      data: product
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logic For New Arrivals :
const getNewArrivals = async (req, res) => {

  // Using Try-Catch :
  try {

    // Find Product :
    const products = await Product
      .find({
        isActive: true,
        isNewArrival: true
      })
      .sort("-createdAt")
      .limit(10);

    // Response :
    res.status(200).json({
      message: "New arrivals",
      data: products
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logic For Best Selling Products :
const getBestSelling = async (req, res) => {

  // Using Try-Catch :
  try {

    // Find Product :
    const products = await Product
      .find({ isActive: true })
      .sort("-totalSold")
      .limit(10)

    // Response :
    res.status(200).json({
      message: "Best selling products.",
      data: products
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logic For Top Rated Products :
const getTopRated = async (req, res) => {

  // Using Try-Catch :
  try {

   // Find Product : 
    const products = await Product
      .find({ isActive: true })
      .sort("-averageRating")
      .limit(10)

    // Response :
    res.status(200).json({
      message: "Top rated products",
      data: products
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logic For Deactivate Product :
const deactivateProduct = async (req, res) => {

  // Using Try-Catch :
  try {
    
    // Find Product :
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    product.isActive = false;

    await product.save();

    res.status(200).json({
      message: "Product deactivated successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// EXPORT MODULES :
module.exports = {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  getNewArrivals,
  getBestSelling,
  getTopRated,
  deactivateProduct
};