require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();
app.use(express.json());


app.use(cors({
  origin: ["http://localhost:3000", "https://www.auraplanners.in","https://auraplanners.in"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

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
    const { email, name, phone , message } = req.body;
    const info = await transporter.sendMail({
      subject: `Enquiry Mail AuraPlanners from: ${name}`,
      to: process.env.SMTP_USER,
      html: `
        <pre>
Name: ${name}
From: ${email}
Phone: ${phone}
Message: ${message}
        </pre>
      `,
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


app.get("/", async (req, res) => {
  try {
    res.json({
      message: "Auraplanner is live"
    });
  } catch (err) {
    console.error("Something went wrong", err);
    res.status(500).json({ error: "Something went wrong please check" });
  }
});


// Start Server
app.listen(process.env.PORT, () => {
  console.log("SMTP Mail API running on port 4000");
});
