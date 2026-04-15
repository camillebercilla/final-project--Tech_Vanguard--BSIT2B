const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    unique: true
  },

  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["user", "admin", "passenger"],
    default: "passenger"
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);