const Cart = require("../Models/cartModel");
const Product = require("../Models/productModel");


// =======================
// Helper Function
// =======================

const buildCartResponse = (cart) => {

  const subtotal = cart.items.reduce(
    (acc, item) => acc + item.priceSnapshot * item.qty,
    0
  )

  const totalItems = cart.items.length

  const totalQty = cart.items.reduce(
    (acc, item) => acc + item.qty,
    0
  )

  return {
    items: cart.items,
    subtotal,
    totalItems,
    totalQty
  }

};

// Logic For Add To Cart :
const addToCart = async (req, res) => {

  // Using Try-Catch :
  try {

    // Get Data From Body :
    const { productId, variantId, qty } = req.body

    const quantity = Number(qty)

    // Using If (For Validation) :
    if (!productId || !variantId || isNaN(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "productId, variantId and valid qty required"
      })
    }

    const product = await Product.findById(productId)

    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not available" })
    }

    const variant = product.variants.id(variantId)

    if (!variant) {
      return res.status(404).json({ message: "Variant not found" })
    }

    if (quantity > variant.stock) {
      return res.status(400).json({ message: "Insufficient stock" })
    }

    let cart = await Cart.findOne({ userId: req.user._id })

    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        items: []
      })
    }

    const existingItem = cart.items.find(
      item =>
        item.productId.toString() === productId &&
        item.variantId.toString() === variantId
    )

    if (existingItem) {

      const newQty = existingItem.qty + quantity

      if (newQty > variant.stock) {
        return res.status(400).json({ message: "Insufficient stock" })
      }

      existingItem.qty = newQty

    }
    else {

      cart.items.push({
        productId,
        variantId,
        qty: quantity,
        priceSnapshot: variant.finalPrice,
        titleSnapshot: product.title,
        imageSnapshot: product.images?.[0] || null
      });

    }

    // Save  Cart :
    await cart.save()

    res.status(200).json({
      status: 200,
      message: "Product added to cart",
      data: buildCartResponse(cart)
    });

  }
  catch (error) {
    res.status(500).json({ message: error.message })
  }

};

// Logic For Update Cart :
const updateCartItem = async (req, res) => {

  // Using Try-Catch :
  try {

    // Get Data From Body :
    const { qty } = req.body

    const quantity = Number(qty)

    // Using If :
    if (isNaN(quantity) || quantity < 0) {
      return res.status(400).json({
        message: "Invalid quantity"
      });
    }

    // Find Cart By User Id :
    const cart = await Cart.findOne({ userId: req.user._id })

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    const item = cart.items.id(req.params.itemId)

    if (!item) {
      return res.status(404).json({ message: "Item not found" })
    }

    // Find Product By Id :
    const product = await Product.findById(item.productId)

    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not available" })
    }

    // Find Variants By Id :
    const variant = product.variants.id(item.variantId)

    if (!variant) {
      return res.status(404).json({ message: "Variant not found" })
    }

    if (quantity === 0) {

      item.deleteOne()

    }
    else {
      if (quantity > variant.stock) {
        return res.status(400).json({ message: "Insufficient stock" });
      }

      item.qty = quantity

    }

    // Save Cart :
    await cart.save()

    // Response :
    res.status(200).json({
      status: 200,
      message: "Cart updated",
      data: buildCartResponse(cart)
    });

  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }

};

// Logic For Remove Item :
const removeCartItem = async (req, res) => {

  // Using Try-Catch :
  try {

    // Find Cart By User Id :
    const cart = await Cart.findOne({ userId: req.user._id })

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    const item = cart.items.id(req.params.itemId)

    if (!item) {
      return res.status(404).json({ message: "Item not found" })
    }

    item.deleteOne()

    await cart.save()

    // Response :
    res.status(200).json({
      status: 200,
      message: "Item removed",
      data: buildCartResponse(cart)
    });

  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }

};

// Logic For Get Cart :
const getCart = async (req, res) => {

  // Using Try-Catch :
  try {

    // Find Cart By User Id :
    const cart = await Cart.findOne({ userId: req.user._id })

    // Using If :
    if (!cart) {
      return res.status(200).json({
        status: 200,
        message: "Cart fetched",
        data: {
          items: [],
          subtotal: 0,
          totalItems: 0,
          totalQty: 0
        }
      });
    };

    // Response :
    res.status(200).json({
      status: 200,
      message: "Cart fetched",
      data: buildCartResponse(cart)
    });

  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }

};

// EXPORT MODULE :
module.exports = {
  addToCart,
  updateCartItem,
  removeCartItem,
  getCart
};