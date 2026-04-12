const router = require("express").Router();
const {
  createBooking,
  getBookings,
  cancelBooking
} = require("../controllers/bookingController");

router.post("/", createBooking);
router.get("/", getBookings);
router.put("/:id", cancelBooking);

module.exports = router;