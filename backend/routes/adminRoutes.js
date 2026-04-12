const router = require("express").Router();
const {
  addTrip,
  editTrip,
  deleteTrip
} = require("../controllers/adminController");

router.post("/trip", addTrip);
router.put("/trip/:id", editTrip);
router.delete("/trip/:id", deleteTrip);

module.exports = router;