// Require NodeMailer :
const nodemailer = require("nodemailer");

// Make Transporter :
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email Notification for Low Stock Products :
const sendLowStockAlert = async (adminEmail, products) => {
  let productList = products.map(
    (product) =>
      `<li>Product: ${product.productTitle} | Variant: ${product.size} ${product.color} | Stock: ${product.stock}</li>`
  );

  const htmlContent = `
    <h2>Low Stock Alert</h2>
    <p>Dear Admin,</p>
    <p>Below are the products that are running low in stock:</p>
    <ul>${productList.join("")}</ul>
    <br>
    <p>Thank you!</p>
  `;

  // Send Email :
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: "Low Stock Alert - Immediate Attention Required",
    html: htmlContent,
  });
};


// Export Module :
module.exports = {
  sendLowStockAlert,
};