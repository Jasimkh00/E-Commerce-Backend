// Require Catgeory Service :
const categoryService = require("../../../Src/modules/category/CategoryService");

// CREATE
const createCategory = async (req, res) => {
  try {
    const data = await categoryService.createCategoryService(req.body);

    res.status(201).json({
      message: "Category created successfully",
      data
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET ALL
const getCategories = async (req, res) => {
  try {
    const data = await categoryService.getCategoriesService();

    res.status(200).json({
      message: "Categories fetched successfully",
      data
    });

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// GET BY ID
const getCategoryById = async (req, res) => {
  try {
    const data = await categoryService.getCategoryByIdService(req.params.id);

    res.status(200).json({
      message: "Category fetched successfully",
      data
    });

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// UPDATE
const updateCategory = async (req, res) => {
  try {
    const data = await categoryService.updateCategoryService(
      req.params.id,
      req.body
    );

    res.status(200).json({
      message: "Category updated successfully",
      data
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DEACTIVATE
const deactivateCategory = async (req, res) => {
  try {
    await categoryService.deactivateCategoryService(req.params.id);

    res.status(200).json({
      message: "Category deactivated successfully"
    });

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Export Module :
module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deactivateCategory
};