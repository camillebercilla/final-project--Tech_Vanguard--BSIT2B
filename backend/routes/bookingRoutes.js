const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { bookSeat } = require("../controllers/bookingController");

router.post("/", auth, bookSeat);

module.exports = router;