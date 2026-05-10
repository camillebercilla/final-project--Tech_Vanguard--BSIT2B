const express = require("express");
const router  = express.Router();

const authMiddleware  = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  addTrip,
  editTrip,
  deleteTrip,
  getUsers,
  deleteUser,
  getBookings,
  updateBooking,
  deleteBooking,
} = require("../controllers/adminController");

// ─── TRIP ROUTES ─────────────────────────────────────────────────
router.post  ("/trips",     authMiddleware, adminMiddleware, addTrip);
router.put   ("/trips/:id", authMiddleware, adminMiddleware, editTrip);
router.delete("/trips/:id", authMiddleware, adminMiddleware, deleteTrip);

// ─── USER ROUTES ─────────────────────────────────────────────────
router.get   ("/users",     authMiddleware, adminMiddleware, getUsers);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);

// ─── BOOKING ROUTES ──────────────────────────────────────────────
router.get   ("/bookings",     authMiddleware, adminMiddleware, getBookings);
router.put   ("/bookings/:id", authMiddleware, adminMiddleware, updateBooking);
router.delete("/bookings/:id", authMiddleware, adminMiddleware, deleteBooking);

module.exports = router;