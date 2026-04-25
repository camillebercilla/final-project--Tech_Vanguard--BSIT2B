const Trip = require("../models/Trip"); // ← one level up, not two (../../)
const User = require("../models/User");
const Booking = require("../models/Booking");

// ─── TRIP MANAGEMENT ───

exports.addTrip = async (req, res) => {
  try {
    const { origin, destination } = req.body;
    if (!origin || !destination) {
      return res.status(400).json({ message: "Origin and destination are required" });
    }
    const trip = await Trip.create(req.body);
    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json({ message: "Trip deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── USER MANAGEMENT ───

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // never send passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── BOOKING MANAGEMENT ───

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email phone");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};