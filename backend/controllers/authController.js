const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
};

exports.login = async (req, res) => {
  const user = await User.findOne(req.body);

  if (!user) return res.status(400).send("Invalid credentials");

  const token = jwt.sign({ id: user._id }, "SECRET_KEY");
  res.json({ token, user });
};