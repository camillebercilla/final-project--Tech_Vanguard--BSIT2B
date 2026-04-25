const Trip = require('../models/Trip'); // ← capital T to match your filename

// GET ALL TRIPS
exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// SEARCH TRIPS by origin and/or destination
exports.searchTrips = async (req, res) => {
  try {
    const { origin, destination } = req.query;

    const filter = {};
    if (origin)      filter.origin      = { $regex: origin,      $options: 'i' };
    if (destination) filter.destination = { $regex: destination, $options: 'i' };

    const trips = await Trip.find(filter);
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ADD TRIP
exports.addTrip = async (req, res) => {
  try {
    const {
      origin,
      destination,
      priceMin,
      priceMax,
      departures,
      duration,
      totalSeats,
      status
    } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({ message: 'Origin and destination are required' });
    }

    const trip = await Trip.create({
      origin,
      destination,
      priceMin:   priceMin   || 0,
      priceMax:   priceMax   || 0,
      departures: departures || [],
      duration:   duration   || '',
      totalSeats: totalSeats || 45,
      status:     status     || 'scheduled'
    });

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE TRIP (edit details, reschedule, or cancel)
exports.updateTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const existingTrip = await Trip.findById(id);
    if (!existingTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Auto-set status to rescheduled if departures array changed
    let status = existingTrip.status;
    if (req.body.departures && 
        JSON.stringify(req.body.departures) !== JSON.stringify(existingTrip.departures)) {
      status = 'rescheduled';
    }

    // Admin manually cancels
    if (req.body.status === 'cancelled') {
      status = 'cancelled';
    }

    // Admin manually resets to scheduled
    if (req.body.status === 'scheduled') {
      status = 'scheduled';
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      id,
      { ...req.body, status },
      { new: true }
    );

    res.json({
      message: 'Trip updated successfully',
      trip: updatedTrip
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE TRIP
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};