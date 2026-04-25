const router = require("express").Router();

const {
  addTrip,
  editTrip,
  deleteTrip,
  getUsers,
  deleteUser,
  getBookings,
  cancelBooking
} = require("../controllers/adminController");

// ─── TRIP ROUTES ───
router.post("/trip",          addTrip);
router.put("/trip/:id",       editTrip);
router.delete("/trip/:id",    deleteTrip);

// ─── USER ROUTES ───
router.get("/users",          getUsers);
router.delete("/users/:id",   deleteUser);

// ─── BOOKING ROUTES ───
router.get("/bookings",       getBookings);
router.put("/bookings/:id",   cancelBooking);

module.exports = router;