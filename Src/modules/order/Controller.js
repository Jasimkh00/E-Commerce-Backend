// Require Order Service :
const orderService = require("../../../Src/modules/order/OrderService");

// PLACE ORDER
const placeOrder = async (req, res) => {
  try {
    const order = await orderService.placeOrderService(
      req.user._id,
      req.body
    );

    res.status(201).json({
      message: "Order placed successfully",
      data: order
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET MY ORDERS
const getMyOrders = async (req, res) => {
  try {
    const orders = await orderService.getMyOrdersService(req.user._id);

    res.status(200).json({
      message: "Orders fetched",
      data: orders
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL ORDERS
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrdersService();

    res.status(200).json({
      message: "All orders fetched",
      data: orders
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE STATUS
const updateOrderStatus = async (req, res) => {
  try {
    const order = await orderService.updateOrderStatusService(
      req.params.orderId,
      req.body.status
    );

    res.status(200).json({
      message: "Order status updated",
      data: order
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// CANCEL ORDER
const cancelOrder = async (req, res) => {
  try {
    const order = await orderService.cancelOrderService(
      req.params.orderId,
      req.user
    );

    res.status(200).json({
      message: "Order cancelled",
      data: order
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Export Modules :
module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
};