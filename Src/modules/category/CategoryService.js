// Require Category Model :
const Category = require("../../../Src/modules/category/Model");

//Logic For CREATE CATEGORY :
const createCategoryService = async (body) => {

  const { name, parentCategory } = body;

  if (!name) {
    throw new Error("Category name is required");
  }

  if (parentCategory) {
    const parent = await Category.findById(parentCategory);

    if (!parent) {
      throw new Error("Invalid parent category ID");
    }
  }

  const category = await Category.create({
    name,
    parentCategory: parentCategory || null
  });

  return category;
};


//Logic For GET ALL CATEGORIES :
const getCategoriesService = async () => {

  const categories = await Category.find({ isActive: true })
    .populate("parentCategory", "name slug");

  if (!categories.length) {
    throw new Error("No categories found");
  }

  return categories;
};


//Logic For GET CATEGORY BY ID :
const getCategoryByIdService = async (id) => {

  const category = await Category.findById(id)
    .populate("parentCategory", "name slug");

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};


// Logic For UPDATE CATEGORY :
const updateCategoryService = async (id, body) => {

  const category = await Category.findById(id);

  if (!category) {
    throw new Error("Category not found");
  }

  const { name, parentCategory, isActive } = body;

  if (name) category.name = name;

  if (parentCategory !== undefined) {

    if (parentCategory === id) {
      throw new Error("Category cannot be its own parent");
    }

    if (parentCategory === null) {
      category.parentCategory = null;
    } else {

      const parent = await Category.findById(parentCategory);

      if (!parent) {
        throw new Error("Invalid parent category");
      }

      category.parentCategory = parentCategory;
    }
  }

  if (typeof isActive !== "undefined") {
    category.isActive = isActive;
  }

  await category.save();

  return category;
};


// Logic For DEACTIVATE CATEGORY :
const deactivateCategoryService = async (id) => {

  const category = await Category.findById(id);

  if (!category) {
    throw new Error("Category not found");
  }

  category.isActive = false;

  await category.save();

  return;
};

// Delete 
const deleteCategoryService = async (id) => {

  const category = await Category.findById(id);

  if (!category) {
    throw new Error("Category not found");
  }

  await Category.findByIdAndDelete(id);

  return;
};

// Export Module :
module.exports = {
  createCategoryService,
  getCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deactivateCategoryService,
  deleteCategoryService
};