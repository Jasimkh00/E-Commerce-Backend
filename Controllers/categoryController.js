// Import Category Model :
const Category = require('../Models/categoryModel');

// Logic For Create Category (For Admin) :
const createCategory = async (req, res) => {

    // Using Try-Catch :
    try {

        // From Body :
        const { name } = req.body;

        // Using If :
        if (!name) {
            return res.status(400).json({ message: 'Category name required .' });
        }

        // Check If Category Already Exists :
        const existing = await Category.findOne({ name });

        if (existing) {
            return res.status(400).json({ message: 'Category already exists .' });
        }

        // Create Category In Database :
        const category = await Category.create({ name });

        // Response To User :
        res.status(201).json({
            message: 'Category Created Successfully .',
            data: category
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error !' });
    }

};


// Logic For Get All Categories (For Public) :
const getCategories = async (req, res) => {

    // Using Try-Catch :
    try {

        // Find All Categories Using Filters Of (Only isActive=true) :
        const categories = await Category.find({ isActive: true });

        // Using If :
        if (categories.length ===0) {
            return res.status(404).json({ message: 'No category found !' });
        }

        // Response :
        res.status(200).json({
            message: 'Your All Categories :',
            data: categories,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error !' });
    }

};


// Logic For Update Category (For Admin ) :
const updateCategory = async (req, res) => {

    // Using Try-Catch :
    try {

        // Get Name And IsActive From Body :
        const { name, isActive } = req.body;

        // Find Category By ID :
        const category = await Category.findById(req.params.id);

        // Using IF :
        if (!category) {
            return res.status(404).json({ message: 'Category Not Found !' });
        }

        // Save Updates :
        if (name) category.name = name;
        if (typeof isActive !== "undefined") category.isActive = isActive;

        await category.save();

        // Response :
        res.status(200).json({
            message: 'Category Updated Successfully .',
            data: category,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error !' });
    }
};


// Logic For Soft Delete Category  (For Admin):
const deleteCategory = async (req, res) => {

    // Using Try-Catch :
    try {

        // Get Category Id From URL :
        const category = await Category.findById(req.params.id);

        // Using IF :
        if (!category) {
            return res.status(404).json({ message: "No Category Found !" });
        }

        // Update And Save :
        category.isActive = false;
        await category.save();

        // Response :
        res.status(200).json({
            message: 'Category Deactivated Successfully.',
            data: category,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error !' });
    }
};


// EXPORT MODULES :
module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
};



