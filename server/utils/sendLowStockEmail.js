const nodemailer = require("nodemailer");

const sendStockAlert = async (lowStockItems) => {
  if (!lowStockItems || lowStockItems.length === 0) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_EMAIL,         // e.g., abhinavkolla007@gmail.com
      pass: process.env.ADMIN_EMAIL_PASSWORD // App password (NOT regular Gmail password)
    },
  });

  const itemList = lowStockItems.map(item => 
    `• ${item.type.toUpperCase()} - ${item.name} (Stock: ${item.stock}, Threshold: ${item.threshold})`
  ).join("\n");

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: process.env.ADMIN_EMAIL, // send to self or multiple admins
    subject: "⚠️ Low Stock Alert - Pizza Inventory",
    text: `The following inventory items are below threshold:\n\n${itemList}\n\nPlease restock soon.`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendStockAlert;