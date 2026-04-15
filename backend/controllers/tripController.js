const Trip = require('../models/trip');

// SEARCH TRIPS
exports.searchTrips = async (req, res) => {
  try {
    const { origin, destination } = req.query;

    const filter = {};

    if (origin) filter.origin = origin;
    if (destination) filter.destination = destination;

    const trips = await Trip.find(filter);

    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL TRIPS
exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ADD TRIP
exports.addTrip = async (req, res) => {
  try {
    const { title, origin, destination, price, departureTime } = req.body;

    const trip = new Trip({
      title,
      origin,
      destination,
      price,
      departureTime // ✅ REQUIRED NOW
    });

    await trip.save();

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE TRIP (RESCHEDULE / CANCEL)
exports.updateTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const existingTrip = await Trip.findById(id);

    if (!existingTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    let status = existingTrip.status;

    // 🌧️ If time changed → RESCHEDULE
    if (
      req.body.departureTime &&
      new Date(req.body.departureTime).toISOString() !==
      existingTrip.departureTime.toISOString()
    ) {
      status = "rescheduled";
    }

    // ❌ If admin cancels
    if (req.body.status === "cancelled") {
      status = "cancelled";
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      id,
      {
        ...req.body,
        status,
        reason: req.body.reason || existingTrip.reason
      },
      { new: true }
    );

    res.json({
      message: "Trip updated successfully",
      trip: updatedTrip
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};