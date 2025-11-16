const pool = require("../configuration/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userEntity = require("../repositories/userDetailsRepository")

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userDetails = await userEntity.getUserDetails(email);
    if (userDetails.length > 0) return res.status(400).json({ error: "Email already in use." });
    const hashedPassword = await bcrypt.hash(password, 10);
    await userEntity.registerUser(email,hashedPassword)
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};

// Login a user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userDetails = await userEntity.getUserDetails(email);
    if (userDetails.length === 0) return res.status(400).json({ error: "Invalid email or password." });
    const user = userDetails[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password." });
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({ token,email});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};
