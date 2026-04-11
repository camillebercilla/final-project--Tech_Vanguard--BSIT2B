const router = require("express").Router();
const { getTrips, addTrip } = require("../controllers/tripController");

router.get("/", getTrips);
router.post("/", addTrip);

module.exports = router;