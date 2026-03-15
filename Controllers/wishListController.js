// Require WishList Model :
const Wishlist = require("../Models/wishListModel");

// Logic For Add To WishList :
const addToWishlist = async (req, res) => {

    // Using Try-Catch :
    try {

        // Get Data From Body :
        const { productId } = req.body

        let wishlist = await Wishlist.findOne({ userId: req.user._id });

        // Using If :
        if (!wishlist) {
            wishlist = await Wishlist.create({
                userId: req.user._id,
                products: [productId]
            });
        }

        //  Checking For Duplicate :
        if (!wishlist.products.includes(productId)) {
            wishlist.products.push(productId)
        };

        // Save WishList :
        await wishlist.save()

        // Response :
        res.status(200).json({
            message: "Product added to wishlist",
            data: wishlist
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};


// Logic For Remove From WishList :
const removeFromWishlist = async (req, res) => {

    // Using Try-Catch :
    try {

        // Get Product Id :
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({ userId: req.user._id });

        if (!wishlist) {
            return res.status(404).json({
                message: "Wishlist not found !"
            });
        }

        //  Using Filter And Save :
        wishlist.products = wishlist.products.filter(
            p => p.toString() !== productId
        );

        await wishlist.save();

        // Response :
        res.status(200).json({
            message: "Product removed from wishlist",
            data: wishlist
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};

// Logic For Get  WishList :
const getWishlist = async (req, res) => {

    // Using Try-Catch :
    try {

        const wishlist = await Wishlist
            .findOne({ userId: req.user._id })
            .populate("products");

        if (!wishlist) {
            return res.status(200).json({
                message: "Wishlist fetched",
                data: []
            });

        }
        //  Response :
        res.status(200).json({
            message: "Wishlist fetched",
            data: wishlist
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};

// EXPORT MODULES :
module.exports = {
    addToWishlist,
    removeFromWishlist,
    getWishlist
};