const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register
exports.register = async (req, res) => {
  try {
    const { userId, name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required"
      });
    }

    // check duplicate email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // OPTIONAL: if userId is provided (admin sets it)
    if (userId) {
      const existingUserId = await User.findOne({ userId });
      if (existingUserId) {
        return res.status(400).json({ message: "User ID already exists" });
      }
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      userId, // 👈 admin-controlled (optional)
      name,
      email,
      password: hashed,
      role
    });

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json("Wrong password");

  const token = jwt.sign(
    { id: user._id, userId: user.userId },
    "secret",
    { expiresIn: "1d" }
  );

  res.json({
    token,
    user: {
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};