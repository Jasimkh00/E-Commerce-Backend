// Require WishList Model :
const Wishlist = require("../../../Src/modules/wishList/Model");

// Logic For Add To Wishlist :
const addToWishlistService = async (userId, body) => {

  const { productId } = body;

  let wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      userId,
      products: [productId]
    });
  }

  // Prevent duplicate
  if (!wishlist.products.includes(productId)) {
    wishlist.products.push(productId);
  }

  await wishlist.save();

  return wishlist;
};

// Logic For Remove From Wishlist :
const removeFromWishlistService = async (userId, productId) => {

  const wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) {
    throw new Error("Wishlist not found !");
  }

  wishlist.products = wishlist.products.filter(
    p => p.toString() !== productId
  );

  await wishlist.save();

  return wishlist;
};

// Logic For Get Wishlist :
const getWishlistService = async (userId) => {

  const wishlist = await Wishlist
    .findOne({ userId })
    .populate("products");

  if (!wishlist) {
    return [];
  }

  return wishlist;
};

// Export Modules :
module.exports = {
  addToWishlistService,
  removeFromWishlistService,
  getWishlistService
};