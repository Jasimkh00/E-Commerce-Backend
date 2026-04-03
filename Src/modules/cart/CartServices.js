// Require Cart And Product Model :
const Cart = require("../../../Src/modules/cart/Model");
const Product = require("../../../Src/modules/product/Model");

// Helper Function
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
    totalQty
  };
};

// Logic For Add CART :
const addToCartService = async (userId, body) => {

  const { productId, variantId, qty } = body;
  const quantity = Number(qty);

  if (!productId || !variantId || isNaN(quantity) || quantity < 1) {
    throw new Error("productId, variantId and valid qty required");
  }

  const product = await Product.findById(productId);

  if (!product || !product.isActive) {
    throw new Error("Product not available");
  }

  const variant = product.variants.id(variantId);

  if (!variant) {
    throw new Error("Variant not found");
  }

  if (quantity > variant.stock) {
    throw new Error("Insufficient stock");
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: []
    });
  }

  const existingItem = cart.items.find(
    item =>
      item.productId.toString() === productId &&
      item.variantId.toString() === variantId
  );

  if (existingItem) {

    const newQty = existingItem.qty + quantity;

    if (newQty > variant.stock) {
      throw new Error("Insufficient stock");
    }

    existingItem.qty = newQty;

  } else {

    cart.items.push({
      productId,
      variantId,
      qty: quantity,
      priceSnapshot: variant.finalPrice,
      titleSnapshot: product.title,
      imageSnapshot: product.images?.[0] || null
    });

  }

  await cart.save();

  return buildCartResponse(cart);
};

//Logic For UPDATE CART :
const updateCartItemService = async (userId, itemId, body) => {

  const { qty } = body;
  const quantity = Number(qty);

  if (isNaN(quantity) || quantity < 0) {
    throw new Error("Invalid quantity");
  }

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const item = cart.items.id(itemId);

  if (!item) {
    throw new Error("Item not found");
  }

  const product = await Product.findById(item.productId);

  if (!product || !product.isActive) {
    throw new Error("Product not available");
  }

  const variant = product.variants.id(item.variantId);

  if (!variant) {
    throw new Error("Variant not found");
  }

  if (quantity === 0) {
    item.deleteOne();
  } else {
    if (quantity > variant.stock) {
      throw new Error("Insufficient stock");
    }
    item.qty = quantity;
  }

  await cart.save();

  return buildCartResponse(cart);
};

// Logic For REMOVE ITEM :
const removeCartItemService = async (userId, itemId) => {

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const item = cart.items.id(itemId);

  if (!item) {
    throw new Error("Item not found");
  }

  item.deleteOne();

  await cart.save();

  return buildCartResponse(cart);
};

//Logic For  GET CART :
const getCartService = async (userId) => {

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return {
      items: [],
      subtotal: 0,
      totalItems: 0,
      totalQty: 0
    };
  }

  return buildCartResponse(cart);
};

// Export Modules :
module.exports = {
  addToCartService,
  updateCartItemService,
  removeCartItemService,
  getCartService
};