// Require Models :
const Order = require("../Models/orderModel");
const Cart = require("../Models/cartModel");
const Product = require("../Models/productModel");
const User = require("../Models/userModel");

// Require Email Order Service (From Utils) :
const {
  sendOrderPlacedEmail,
  sendOrderStatusEmail
} = require("../Utils/emailOrderService");

// Generate Order Number :
const generateOrderNumber = () => {

  const date = new Date()

  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")

  const random = Math.floor(1000 + Math.random() * 9000)

  return `ORD-${y}${m}${d}-${random}`
};

// Logic For Place Order (For Public) :
const placeOrder = async (req, res) => {

  // Using Try-Catch :
  try {

    // Get Data From Body :
    const { shippingAddress, paymentMethod } = req.body

    // Using If :
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        message: "Shipping address and payment method required."
      });
    }

    // Find Cart By User Id :
    const cart = await Cart.findOne({ userId: req.user._id })

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty !" })
    }

    let subtotal = 0
    const orderItems = []

    for (const item of cart.items) {

      // Find Product By Id :
      const product = await Product.findById(item.productId)

      if (!product || !product.isActive) {
        return res.status(404).json({
          message: `Product not available`
        });
      }

      // Find Varient By Id :
      const variant = product.variants.id(item.variantId)

      if (!variant || variant.stock < item.qty) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.titleSnapshot}`
        });
      };

      // Stock Managements  (For Over Selling):
      variant.stock = variant.stock - item.qty
      product.totalSold = product.totalSold + item.qty
      product.totalStock = product.totalStock - item.qty

      // Save Product :
      await product.save();

      subtotal += item.priceSnapshot * item.qty

      orderItems.push({
        productId: item.productId,
        variantId: item.variantId,
        titleSnapshot: item.titleSnapshot,
        priceSnapshot: item.priceSnapshot,
        imageSnapshot: item.imageSnapshot,
        qty: item.qty
      });

    };

    // Create Order :
    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      userId: req.user._id,
      items: orderItems,
      subtotal,
      shippingAddress,
      paymentMethod

    });

    const user = await User.findById(req.user._id)

    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + 5)

    // Send Email :
    try {

      await sendOrderPlacedEmail(
        user.email,
        order,
        deliveryDate.toDateString()
      );

    } catch (e) {
      console.log("Email error", e.message);
    };

    // Save Cart :
    cart.items = []
    await cart.save()

    // Response :
    res.status(201).json({
      message: "Order placed successfully .",
      data: order

    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  };

};


// Logic For Get My Orders (For Public) :
const getMyOrders = async (req, res) => {

  // Using Try-Catch :
  try {

    const orders = await Order
      .find({ userId: req.user._id })
      .sort("-createdAt")

    res.status(200).json({
      message: "Orders fetched",
      data: orders

    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  };

};

// LogicFor Get All Orders (For Admin) :
const getAllOrders = async (req, res) => {

  // Using Try-Catch :
  try {

    const orders = await Order
      .find()
      .populate("userId", "fullName email")
      .sort("-createdAt")

    res.status(200).json({
      message: "All orders fetched",
      data: orders

    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  };

};

// Logic For Update Order Status (For Admin) :
const updateOrderStatus = async (req, res) => {

  // Using Try-Catch :
  try {

    const { status } = req.body

    const allowedStatus = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled"
    ]

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status"
      });
    }
    const order = await Order.findById(req.params.orderId);

    // Using If :
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status

    await order.save()

    // Find User And Send Email :
    const user = await User.findById(order.userId);

    // Using Try-Catch :
    try {
      await sendOrderStatusEmail(user.email, order)

    } catch (e) {
      console.log("Email error", e.message);
    }

    // Response :
    res.status(200).json({
      message: "Order status updated",
      data: order
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  };

};

// Logic For Order Cancel (For Public) :
const cancelOrder = async (req, res) => {

  // Using Try-Catch :
  try {

    const order = await Order.findById(req.params.orderId)

    if (!order) {
      return res.status(404).json({ message: "Order not found !" });
    }

    if (
      order.userId.toString() !== req.user._id.toString()
      && req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized !"
      });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({
        message: "Order already cancelled ."
      });
    }

    if (order.status === "shipped" || order.status === "delivered") {
      return res.status(400).json({
        message: "Order cannot be cancelled"
      });
    }

    for (const item of order.items) {

      const product = await Product.findById(item.productId)

      if (product) {

        const variant = product.variants.id(item.variantId)

        if (variant) {
          variant.stock = variant.stock + item.qty
          product.totalStock = product.totalStock + item.qty
          await product.save();

        }

      };

    }
    // Status Changed :
    order.status = "cancelled"
    await order.save();

    // Find User And Send Email :
    const user = await User.findById(order.userId)
    await sendOrderStatusEmail(user.email, order)

    // Response :
    res.status(200).json({
      message: "Order cancelled",
      data: order

    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  };

};

// EXPORT MODULES:
module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
};