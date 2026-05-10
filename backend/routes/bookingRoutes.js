const router = require("express").Router();

const {
  createBooking,
  getBookings,
  getBookingById,
  getUserBookings,
  cancelBooking,
  rescheduleBooking,
} = require("../controllers/bookingController");

// Create booking
router.post("/", createBooking);

// Get all bookings (admin)
router.get("/", getBookings);

// ⚠️  /user/:id  MUST come before  /:id
// otherwise Express matches "user" as the :id param
router.get("/user/:id", getUserBookings);

// Get single booking by MongoDB _id  ← NEW (used by check-status page)
router.get("/:id", getBookingById);

// Reschedule booking
router.put("/:id", rescheduleBooking);

// Cancel booking
router.delete("/:id", cancelBooking);

module.exports = router;