require("dotenv").config();
const express = require("express");
const pool = require("../src/configuration/connection");
const auth = require("./middleware/middlewareAuth");
const authRoutes = require("./routes/auth");
const fileRoutes = require("./routes/files");
const cors = require("cors");
const nodemailer = require("nodemailer");
const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "https://www.auraplanners.in","https://auraplanners.in'"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

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
  secure: false, // Gmail uses TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // APP PASSWORD ONLY
  },
});


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/content", fileRoutes);

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



// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
