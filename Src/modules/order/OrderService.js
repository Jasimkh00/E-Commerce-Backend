// Require :
const Order = require("../../../Src/modules/order/Model");
const Cart = require("../../../Src/modules/cart/Model");
const Product = require("../../../Src/modules/product/Model");
const User = require("../../../Src/modules/auth/Model");

const {
  sendOrderPlacedEmail,
  sendOrderStatusEmail
} = require("../../../Src/Utils/emailOrderService");

// Generate Order Number
const generateOrderNumber = () => {
  const date = new Date()

  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")

  const random = Math.floor(1000 + Math.random() * 9000)

  return `ORD-${y}${m}${d}-${random}`
};

// PLACE ORDER
const placeOrderService = async (userId, body) => {

  const { shippingAddress, paymentMethod } = body

  if (!shippingAddress || !paymentMethod) {
    throw new Error("Shipping address and payment method required.")
  }

  const cart = await Cart.findOne({ userId })

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty !")
  }

  let subtotal = 0
  const orderItems = []

  for (const item of cart.items) {

    const product = await Product.findById(item.productId)

    if (!product || !product.isActive) {
      throw new Error(`Product not available`)
    }

    const variant = product.variants.id(item.variantId)

    if (!variant || variant.stock < item.qty) {
      throw new Error(`Insufficient stock for ${item.titleSnapshot}`)
    }

    // stock update
    variant.stock -= item.qty
    product.totalSold += item.qty
    product.totalStock -= item.qty

    await product.save()

    subtotal += item.priceSnapshot * item.qty

    orderItems.push({
      productId: item.productId,
      variantId: item.variantId,
      titleSnapshot: item.titleSnapshot,
      priceSnapshot: item.priceSnapshot,
      imageSnapshot: item.imageSnapshot,
      qty: item.qty
    });
  }

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    userId,
    items: orderItems,
    subtotal,
    shippingAddress,
    paymentMethod
  });

  const user = await User.findById(userId)

  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 5)

  // NON-BLOCKING EMAIL (FIXED)
  setImmediate(() => {
    sendOrderPlacedEmail(
      user.email,
      order,
      deliveryDate.toDateString()
    ).catch((e) => {
      console.log("Email error:", e.message);
    });
  });

  cart.items = []
  await cart.save()

  return order
};

// GET MY ORDERS
const getMyOrdersService = async (userId) => {
  return await Order.find({
    userId,
    status: { $ne: "cancelled" } 
  }).sort("-createdAt");
};

// Get All Orders Service :
const getAllOrdersService = async () => {
  return await Order.find({ status: { $ne: "cancelled" } }) 
    .populate("userId", "fullName email")
    .sort("-createdAt");
};

// UPDATE STATUS
const updateOrderStatusService = async (orderId, status) => {
  const allowedStatus = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

  if (!allowedStatus.includes(status)) {
    throw new Error("Invalid order status");
  }

  //  DIRECT UPDATE (single DB call)
  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  ).lean();

  if (!updatedOrder) {
    throw new Error("Order not found");
  }

  // USER FETCH
  const user = await User.findById(updatedOrder.userId).lean();

  // NON-BLOCKING EMAIL
  setImmediate(() => {
    sendOrderStatusEmail(user?.email, updatedOrder).catch(() => {});
  });

  return updatedOrder;
};

// CANCEL ORDER
const cancelOrderService = async (orderId, user) => {

  const order = await Order.findById(orderId)

  if (!order) throw new Error("Order not found !")

  if (
    order.userId.toString() !== user._id.toString()
    && user.role !== "admin"
  ) {
    throw new Error("Not authorized !")
  }

  if (order.status === "cancelled") {
    throw new Error("Order already cancelled")
  }

  if (["shipped", "delivered"].includes(order.status)) {
    throw new Error("Order cannot be cancelled")
  }

  //  IMMEDIATE STATUS UPDATE (FAST RESPONSE)
  order.status = "cancelled"
  await order.save()

  //  BACKGROUND WORK (NON-BLOCKING)
  setImmediate(async () => {
    try {

      const productIds = order.items.map(i => i.productId)

      const products = await Product.find({ _id: { $in: productIds } })

      const productMap = {}
      products.forEach(p => {
        productMap[p._id.toString()] = p
      })

      for (const item of order.items) {
        const product = productMap[item.productId.toString()]

        if (product) {
          const variant = product.variants.id(item.variantId)

          if (variant) {
            variant.stock += item.qty
            product.totalStock += item.qty
          }
        }
      }

      await Promise.all(products.map(p => p.save()))

      const userData = await User.findById(order.userId)

      await sendOrderStatusEmail(userData.email, order)

    } catch (e) {
      console.log("Cancel background error:", e.message)
    }
  })

  return order
};

// Export Modules :
module.exports = {
  placeOrderService,
  getMyOrdersService,
  getAllOrdersService,
  updateOrderStatusService,
  cancelOrderService
};


