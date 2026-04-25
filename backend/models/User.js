const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
    unique: true,
    sparse: true   // allows multiple docs without userId (not required anymore)
  },

  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone:    { type: String, default: "" },  // ← ADDED: frontend sends this

  role: {
    type: String,
    enum: ["user", "admin", "passenger"],
    default: "user"   // ← CHANGED: "passenger" → "user" to match your frontend
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);