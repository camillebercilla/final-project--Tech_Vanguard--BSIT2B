const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register
exports.register = async (req, res) => {
  try {
    const { userId, name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (userId) {
      const existingUserId = await User.findOne({ userId });
      if (existingUserId) {
        return res.status(400).json({ message: "User ID already exists" });
      }
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      userId,
      name,
      email,
      phone: phone || "",
      password: hashed,
      role: role || "user"
    });

    // Return shape that frontend expects
    res.status(201).json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      phone: user.phone,
      role:  user.role
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

  const token = jwt.sign(
  {
    id: user._id,
    userId: user.userId,
    role: user.role   // 🔥 ADD THIS LINE
  },
  process.env.JWT_SECRET || "secret",
  { expiresIn: "1d" }
);

    // Return shape that frontend expects
    res.json({
      token,
      _id:   user._id,
      name:  user.name,
      email: user.email,
      phone: user.phone || "",
      role:  user.role
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};