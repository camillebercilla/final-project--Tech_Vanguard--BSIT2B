const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName:       { type: String },
  route:          { type: String },
  seat:           { type: String },
  date:           { type: String },
  departure:      { type: String },
  price:          { type: Number },
  status:         { type: String, default: "confirmed" },
  paymentMethod:  { type: String, default: "Cash" },
  passengerName:  { type: String },
  passengerEmail: { type: String },
  passengerPhone: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);