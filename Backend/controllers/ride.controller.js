const Ride = require('../models/ride.model');
const Captain = require('../models/captain.model');
const User = require('../models/user.model');
const { getIO } = require('../socket/socket');

exports.createRide = async (req, res) => {
  try {
    const io = getIO();
    const { userId, captainId, pickup, drop, fare, distance, duration } = req.body;
    if (!userId || !captainId || !pickup || !drop || !fare) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const ride = await Ride.create({
      user: userId,
      pickup: { address: pickup.name || pickup.address, latitude: pickup.lat ?? pickup.latitude, longitude: pickup.lng ?? pickup.longitude },
      drop: { address: drop.name || drop.address, latitude: drop.lat ?? drop.latitude, longitude: drop.lng ?? drop.longitude },
      fare, distance, duration,
    });
    const captain = await Captain.findById(captainId);
    if (captain && captain.socketId) {
      const populatedRide = await Ride.findById(ride._id).populate('user', 'fullname email');
      io.to(captain.socketId).emit('new-ride-request', populatedRide);
    }
    res.status(201).json({ success: true, message: 'Ride request sent', ride });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Ride creation failed' });
  }
};

exports.getNearbyCaptains = async (req, res) => {
  try {
    const captains = await Captain.find({ status: 'active' }).select('-password');
    res.json({ success: true, captains });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching captains' });
  }
};

exports.acceptRide = async (req, res) => {
  try {
    const io = getIO();
    const { rideId, captainId } = req.body;
    const ride = await Ride.findById(rideId).populate('user', 'fullname socketId');
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    if (ride.rideStatus !== 'pending') return res.status(400).json({ message: 'Ride already accepted' });
    ride.captain = captainId;
    ride.rideStatus = 'accepted';
    await ride.save();
    const captain = await Captain.findById(captainId).select('-password');
    if (ride.user && ride.user.socketId) {
      io.to(ride.user.socketId).emit('ride-accepted', { rideId: ride._id, captain });
    }
    res.json({ success: true, message: 'Ride accepted', ride, captain });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error accepting ride' });
  }
};

exports.rejectRide = async (req, res) => {
  try {
    const io = getIO();
    const { rideId } = req.body;
    const ride = await Ride.findById(rideId).populate('user', 'socketId');
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    ride.rideStatus = 'cancelled';
    await ride.save();
    if (ride.user && ride.user.socketId) {
      io.to(ride.user.socketId).emit('ride-rejected', { rideId });
    }
    res.json({ success: true, message: 'Ride rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Reject error' });
  }
};

exports.startRide = async (req, res) => {
  try {
    const io = getIO();
    const { rideId } = req.body;
    const ride = await Ride.findByIdAndUpdate(rideId, { rideStatus: 'ongoing' }, { new: true });
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    io.emit('ride-started', ride);
    res.json({ success: true, ride });
  } catch (error) {
    res.status(500).json({ message: 'Start ride error' });
  }
};

exports.completeRide = async (req, res) => {
  try {
    const io = getIO();
    const { rideId } = req.body;
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    ride.rideStatus = 'completed';
    await ride.save();
    if (ride.captain) {
      await Captain.findByIdAndUpdate(ride.captain, { $inc: { totalRidesCompleted: 1 } });
    }
    io.emit('ride-completed', ride);
    res.json({ success: true, message: 'Ride completed' });
  } catch (error) {
    res.status(500).json({ message: 'Complete ride error' });
  }
};

exports.cancelRide = async (req, res) => {
  try {
    const io = getIO();
    const { rideId } = req.body;
    const ride = await Ride.findById(rideId).populate('user', 'socketId');
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    ride.rideStatus = 'cancelled';
    await ride.save();
    if (ride.user && ride.user.socketId) {
      io.to(ride.user.socketId).emit('ride-cancelled', { rideId });
    }
    res.json({ success: true, message: 'Ride cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Cancel ride error' });
  }
};

exports.updateCaptainLocation = async (req, res) => {
  try {
    const io = getIO();
    const { captainId, latitude, longitude } = req.body;
    await Captain.findByIdAndUpdate(captainId, { location: { latitude, longitude } });
    io.emit('captain-location-update', { captainId, latitude, longitude });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Location update failed' });
  }
};

exports.getRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId)
      .populate('user', 'fullname email')
      .populate('captain', 'fullname vehicle');
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    res.json({ success: true, ride });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ride' });
  }
};

exports.getCaptainTodayStats = async (req, res) => {
  try {
    const { captainId } = req.params;
 
    // Build start and end of today in UTC
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
 
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
 
    const completedRides = await Ride.find({
      captain: captainId,
      rideStatus: 'completed',
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
 
    const totalEarned = completedRides.reduce((sum, ride) => sum + (ride.fare || 0), 0);
    const ridesCompleted = completedRides.length;
 
    res.json({ success: true, totalEarned, ridesCompleted });
  } catch (error) {
    console.error('getCaptainTodayStats error:', error);
    res.status(500).json({ message: 'Error fetching today stats' });
  }
};