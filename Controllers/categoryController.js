// Require Category Model :
const Category = require("../Models/categoryModel");

// Logic For  Create Category (Parent Or Child) :
const createCategory = async (req, res) => {

  // Using Try-Catch :
  try {

    // Get Data From Body :
    const { name, parentCategory } = req.body;

    // Category name required :
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // If parentCategory is provided then validate it :
    if (parentCategory) {
      const parent = await Category.findById(parentCategory);

      if (!parent) {
        return res.status(400).json({ message: "Invalid parent category ID" });
      }
    }

    // Create category(If Parent Category Is Not Provided Then Null) :
    const category = await Category.create({
      name,
      parentCategory: parentCategory || null
    });

    // Response :
    res.status(201).json({
      message: "Category created successfully",
      data: category
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};


// Logic for Get All Categories :
const getCategories = async (req, res) => {

  // Using Try-Catch :
  try {
    const categories = await Category.find({ isActive: true })
      .populate("parentCategory", "name slug");

    // Using If :
    if (!categories.length) {
      return res.status(404).json({ message: "No categories found" });
    }

    // Response :
    res.status(200).json({
      message: "Categories fetched successfully",
      data: categories
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

//Logic For Get Category By ID :
const getCategoryById = async (req, res) => {

  // Using Try-Catch :
  try {

    const category = await Category.findById(req.params.id)
      .populate("parentCategory", "name slug");

    // Using If :
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Response :
    res.status(200).json({
      message: "Category fetched successfully",
      data: category
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

// Logic For  Update Category :
const updateCategory = async (req, res) => {

  // Using Try-Catch :
  try {

    // Find Category By Id :
    const category = await Category.findById(req.params.id);

    // Using If :
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const { name, parentCategory, isActive } = req.body;

    if (name) category.name = name;
    if (parentCategory !== undefined) {

      if (parentCategory === req.params.id) {
        return res.status(400).json({
          message: "Category cannot be its own parent"
        });
      }

      if (parentCategory === null) {
        category.parentCategory = null
      }
      else {
        const parent = await Category.findById(parentCategory)

        if (!parent) {
          return res.status(400).json({
            message: "Invalid parent category"
          });
        }

        category.parentCategory = parentCategory

      };

    }
    if (typeof isActive !== "undefined") category.isActive = isActive;

    // Save Category :
    await category.save();

    // Response :
    res.status(200).json({
      message: "Category updated successfully",
      data: category
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

// Logic For Deactivate Category :
const deactivateCategory = async (req, res) => {

  // Using Try-Catch :
  try {

    // Find Category By Id :
    const category = await Category.findById(req.params.id);

    // Using If :
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.isActive = false;

    // Save Category :
    await category.save();

    // Response :
    res.status(200).json({ message: "Category deactivated successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

// EXPORT MODULES :
module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deactivateCategory
};