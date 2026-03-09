const Order = require("../Models/orderModel");
const Cart = require("../Models/cartModel");
const Product = require("../Models/productModel");
const User = require("../Models/userModel");
const { sendOrderPlacedEmail, sendOrderStatusEmail } = require("../Utils/emailOrderService");

// Logic For Place Order (For Public):
const placeOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        message: "Shipping address and payment method required",
      });
    }

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    let subtotal = 0;

    // STOCK VERIFY + DEDUCT
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);

      if (!product || product.stockTotal < item.qty) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.titleSnapshot}`,
        });
      }

      product.stockTotal -= item.qty;
      await product.save();

      subtotal += item.priceSnapshot * item.qty;
    }

    // CREATE ORDER
    const order = await Order.create({
      userId: req.user._id,
      items: cart.items,
      subtotal,
      shippingAddress,
      paymentMethod,
    });

    const user = await User.findById(req.user._id);

    // Delivery date example (5 days later)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    // Send order placed email (async handling)
    try {
      await sendOrderPlacedEmail(
        user.email,
        order,
        deliveryDate.toDateString()
      );
    } catch (emailError) {
      console.log("Email failed but order placed:", emailError.message);
    }

    // CLEAR CART
    cart.items = [];
    await cart.save();

    return res.status(201).json({
      message: "Order placed successfully",
      data: order,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Logic For Get My Order (For Public) :
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort("-createdAt");

    return res.status(200).json({
      message: "Orders fetched",
      data: orders,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Logic For Get All Orders (For Admin):
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "fullName email")  // Corrected to fullName
      .sort("-createdAt");

    return res.status(200).json({
      message: "All orders fetched",
      data: orders,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Logic For Update Order Status (For Admin) :
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    // Get user email
    const user = await User.findById(order.userId);

    // Send status email
    try {
      await sendOrderStatusEmail(user.email, order);
    } catch (emailError) {
      console.log("Error sending status update email:", emailError.message);
    }

    return res.status(200).json({
      message: "Order status updated",
      data: order,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Logic For Order Cancel (For Public):
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Check ownership (unless admin)
    if (
      order.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized to cancel this order",
      });
    }

    // Prevent double cancel
    if (order.status === "cancelled") {
      return res.status(400).json({
        message: "Order already cancelled",
      });
    }

    // Cannot cancel shipped And delivered
    if (order.status === "shipped" || order.status === "delivered") {
      return res.status(400).json({
        message: "Order cannot be cancelled after shipment",
      });
    }

    // Restore stock (Improvement: Added error logging and checking)
    for (const item of order.items) {
      const product = await Product.findById(item.productId);

      if (product) {
        product.stockTotal += item.qty;  // Stock restore here
        await product.save();
      } else {
        console.error(`Product not found for order item: ${item.productId}`);
        return res.status(404).json({
          message: `Product with ID ${item.productId} not found`,
        });
      }
    }

    // Update order status
    order.status = "cancelled";
    await order.save();

    // Send email on cancellation
    const user = await User.findById(order.userId);
    await sendOrderStatusEmail(user.email, order);

    return res.status(200).json({
      message: "Order cancelled successfully",
      data: order,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};