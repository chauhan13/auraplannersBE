require("dotenv").config();
const express = require("express");
const pool = require("../src/configuration/connection");
const authRoutes = require("./routes/auth");
const fileRoutes = require("./routes/files");
const cors = require("cors");
const nodemailer = require("nodemailer");
const app = express();

/* ---- FIXED CORS CONFIG ---- */
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://auraplanners.in",
    "https://www.auraplanners.in"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

// Preflight request handler
app.options("*", cors());

app.use(express.json());

(async () => {
  try {
    const result = await pool.query('SELECT 1');
    console.log("Connected to MySQL database successfully!");
  } catch (err) {
    console.error("Error connecting to MySQL database:", err);
    process.exit(1);
  }
})();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/* ---- FIXED EMAIL ROUTE WITH CORS ---- */
app.post("/send-email", async (req, res) => {
  try {
    const { email, name, phone, message } = req.body;

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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
