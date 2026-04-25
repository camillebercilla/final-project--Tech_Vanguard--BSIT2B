const express = require("express");
const router  = express.Router();
const Bus     = require("../models/Bus");

// GET all buses
router.get("/buses", async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD a bus
router.post("/buses", async (req, res) => {
  try {
    const { companyName, totalSeats, busType } = req.body;

    if (!companyName || !totalSeats) {
      return res.status(400).json({ message: "Company name and total seats are required" });
    }

    const bus = await Bus.create({
      companyName,
      totalSeats,
      busType: busType || "Regular"
    });

    res.status(201).json(bus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a bus
router.put("/buses/:id", async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!bus) return res.status(404).json({ message: "Bus not found" });
    res.json(bus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a bus
router.delete("/buses/:id", async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) return res.status(404).json({ message: "Bus not found" });
    res.json({ message: "Bus deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;