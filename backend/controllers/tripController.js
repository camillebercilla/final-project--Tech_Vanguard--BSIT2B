const Trip = require('../models/Trip');

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
    const { title, origin, destination, price } = req.body;

    const trip = new Trip({
      title,
      origin,
      destination,
      price
    });

    await trip.save();

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};