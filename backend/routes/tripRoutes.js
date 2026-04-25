const express = require("express");
const router = express.Router();

const {
  getTrips,
  addTrip,
  searchTrips,
  updateTrip,
  deleteTrip
} = require("../controllers/tripController");

// Get all trips
router.get("/", getTrips);

// Search trips
router.get("/search", searchTrips);

// Add trip
router.post("/", addTrip);

// Update trip
router.put("/:id", updateTrip);

// Delete trip
router.delete("/:id", deleteTrip);

module.exports = router;

