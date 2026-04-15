const router = require("express").Router();

const {
  createBooking,
  getBookings,
  cancelBooking,
  getUserBookings,
  rescheduleBooking   
} = require("../controllers/bookingController");

// Create booking
router.post("/", createBooking);

// Get all bookings
router.get("/", getBookings);

// Get bookings of a specific user 👇 ADD THIS
router.get("/user/:id", getUserBookings);

// Cancel booking
router.delete("/:id", cancelBooking);

router.put("/:id", rescheduleBooking);

module.exports = router;