// Require Wishlist Service :
const wishlistService = require("../../../Src/modules/wishList/WishlistService");

// ADD TO WISHLIST
const addToWishlist = async (req, res) => {
  try {

    const wishlist = await wishlistService.addToWishlistService(
      req.user._id,
      req.body
    );

    res.status(200).json({
      message: "Product added to wishlist",
      data: wishlist
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REMOVE FROM WISHLIST
const removeFromWishlist = async (req, res) => {
  try {

    const wishlist = await wishlistService.removeFromWishlistService(
      req.user._id,
      req.params.productId
    );

    res.status(200).json({
      message: "Product removed from wishlist",
      data: wishlist
    });

  } catch (error) {
    if (error.message === "Wishlist not found !") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: error.message });
  }
};

// GET WISHLIST
const getWishlist = async (req, res) => {
  try {

    const wishlist = await wishlistService.getWishlistService(
      req.user._id
    );

    res.status(200).json({
      message: "Wishlist fetched",
      data: wishlist
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export Modules :
module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist
};