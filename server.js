require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

// SMTP Transporter (Gmail)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Gmail uses TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // APP PASSWORD ONLY
  },
});

// Send Email API
app.post("/send-email", async (req, res) => {
  try {
    const { from,name, subject, message } = req.body;

    const info = await transporter.sendMail({
      from: `Enquiry Mail Customer  :${name} `,
      to:`${process.env.SMTP_USER}`,
      subject,
      html: `<p>${message}</p><br><p>Customer Mail = ${from}`,
    });

    res.json({
      message: "Email sent successfully",
      messageId: info.messageId,
    });
  } catch (err) {
    console.error("SMTP Error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Start Server
app.listen(process.env.PORT, () => {
  console.log("SMTP Mail API running on port 4000");
});
