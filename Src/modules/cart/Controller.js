// Require Cart Service  :
const {
  addToCartService,
  updateCartItemService,
  removeCartItemService,
  getCartService
} = require("../../../Src/modules/cart/CartServices");

// ADD TO CART
const addToCart = async (req, res) => {
  try {

    const data = await addToCartService(req.user._id, req.body);

    res.status(200).json({
      status: 200,
      message: "Product added to cart",
      data
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE CART
const updateCartItem = async (req, res) => {
  try {

    const data = await updateCartItemService(
      req.user._id,
      req.params.itemId,
      req.body
    );

    res.status(200).json({
      status: 200,
      message: "Cart updated",
      data
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// REMOVE ITEM
const removeCartItem = async (req, res) => {
  try {

    const data = await removeCartItemService(
      req.user._id,
      req.params.itemId
    );

    res.status(200).json({
      status: 200,
      message: "Item removed",
      data
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET CART
const getCart = async (req, res) => {
  try {

    const data = await getCartService(req.user._id);

    res.status(200).json({
      status: 200,
      message: "Cart fetched",
      data
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export Modules :
module.exports = {
  addToCart,
  updateCartItem,
  removeCartItem,
  getCart
};