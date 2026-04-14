const express = require("express");
const router = express.Router();

let buses = [];

router.get("/buses", (req, res) => {
  res.json(buses);
});

router.post("/buses", (req, res) => {
  const { companyName, totalSeats, busType } = req.body;

  const newBus = {
    id: Date.now().toString(),
    companyName,
    totalSeats,
    busType
  };

  buses.push(newBus);

  res.json(newBus);
});

module.exports = router; // ✅ IMPORTANT