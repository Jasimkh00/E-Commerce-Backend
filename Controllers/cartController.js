const Cart = require("../Models/cartModel");
const Product = require("../Models/productModel");


// ===============================
// HELPER FUNCTION (Totals)
// ===============================
const buildCartResponse = (cart) => {
  const subtotal = cart.items.reduce(
    (acc, item) => acc + item.priceSnapshot * item.qty,
    0
  );

  const totalItems = cart.items.length;

  const totalQty = cart.items.reduce(
    (acc, item) => acc + item.qty,
    0
  );

  return {
    items: cart.items,
    subtotal,
    totalItems,
    totalQty,
  };
};


// Logic For Add To Cart (For Public):
const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const quantity = Number(qty);

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Valid product and quantity required" });
    }

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not available" });
    }

    if (quantity > product.stockTotal) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      const newQty = existingItem.qty + quantity;

      if (newQty > product.stockTotal) {
        return res.status(400).json({ message: "Insufficient stock" });
      }

      existingItem.qty = newQty;
    } else {
      cart.items.push({
        productId,
        qty: quantity,
        priceSnapshot: product.finalPrice,
        titleSnapshot: product.title,
        imageSnapshot: product.images?.[0] || null,
      });
    }

    await cart.save();

    return res.status(200).json({
      message: "Product added to cart",
      data: buildCartResponse(cart),
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Logic For Update Cart Item (For Public):
const updateCartItem = async (req, res) => {
  try {
    const { qty } = req.body;
    const quantity = Number(qty);

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const product = await Product.findById(item.productId);

    if (!product || quantity > product.stockTotal) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    item.qty = quantity;

    await cart.save();

    return res.status(200).json({
      message: "Cart updated",
      data: buildCartResponse(cart),
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Logic For Remove Cart Item (For Public):
const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.deleteOne();
    await cart.save();

    return res.status(200).json({
      message: "Item removed",
      data: buildCartResponse(cart),
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Logic for Get Cart (For Public):
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(200).json({
        message: "Cart fetched",
        data: {
          items: [],
          subtotal: 0,
          totalItems: 0,
          totalQty: 0,
        },
      });
    }

    return res.status(200).json({
      message: "Cart fetched",
      data: buildCartResponse(cart),
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


module.exports = {
  addToCart,
  updateCartItem,
  removeCartItem,
  getCart,
};