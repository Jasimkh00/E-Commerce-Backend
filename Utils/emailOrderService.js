const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// ORDER PLACED EMAIL
const sendOrderPlacedEmail = async (userEmail, order, deliveryDate) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Order Confirmation - Your Order Has Been Placed",
    html: `
      <h2>Thank you for your order 🎉</h2>
      <p><b>Order ID:</b> ${order._id}</p>
      <p><b>Total:</b> Rs ${order.subtotal}</p>
      <p><b>Estimated Delivery:</b> ${deliveryDate}</p>
      <br/>
      <p>We will notify you when your order status changes.</p>
    `,
  });
};

// ORDER STATUS UPDATE EMAIL
const sendOrderStatusEmail = async (userEmail, order) => {
  let message = "";

  if (order.status === "confirmed") {
    message = "Your order has been confirmed ✅";
  }

  if (order.status === "shipped") {
    message = "Your order has been shipped 🚚";
  }

  if (order.status === "delivered") {
    message = "Your order has been delivered 📦";
  }

  if (order.status === "cancelled") {
    message = "Your order has been cancelled ❌";
  }

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Order Status Updated - ${order.status.toUpperCase()}`,
    html: `
      <h2>${message}</h2>
      <p><b>Order ID:</b> ${order._id}</p>
      <p><b>Total:</b> Rs ${order.subtotal}</p>
      <p><b>Current Status:</b> ${order.status}</p>
      <br/>
      <p>Thank you for shopping with us .</p>
    `,
  });
};

module.exports = {
  sendOrderPlacedEmail,
  sendOrderStatusEmail,
};