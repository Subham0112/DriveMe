const Captain = require('../models/captain.model');
const Ride = require('../models/ride.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
const blacklistToken = require('../models/tokenBacklist.model');

// ── REGISTER ─────────────────────────────────────────────────────
const registerCaptain = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullname, email, password, phone, vehicle } = req.body;

  const Findcaptain = await Captain.findOne({ email });
  if (Findcaptain) {
    return res.status(400).json({ message: 'Captain already exists' });
  }

  const hashedPassword = await Captain.hashPassword(password);
  const captain = await captainService.createCaptain({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
    phone,
    vehicle: vehicle,
  });

  res.status(201).json({ captain });
  console.log("captain created");
};

// ── LOGIN ───────────────────────────────────────────────────────────
const loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const captain = await Captain.findOne({ email }).select('+password');
  if (!captain) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const isPasswordMatch = await captain.comparePassword(password);
  if (!isPasswordMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = captain.generateAuthToken();
  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  });
  res.status(200).json({ captain, token });
  console.log("captain logged in");
};

// ── GET PROFILE ───────────────────────────────────────────────────
const getCaptainProfile = async (req, res, next) => {
  res.status(200).json(req.captain);
};

// ── UPDATE STATUS (active / inactive toggle) ──────────────────────
const updateCaptainStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: 'Status must be active or inactive.' });
    }
    const updated = await Captain.findByIdAndUpdate(
      req.captain._id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Captain not found' });
    res.json({ success: true, captain: updated, message: `Status set to ${status}` });
  } catch (err) {
    console.error('updateCaptainStatus error:', err);
    res.status(500).json({ message: 'Could not update status' });
  }
};

// ── UPDATE PERSONAL PROFILE ───────────────────────────────────────
const updateCaptainProfile = async (req, res) => {
  try {
    const { fullname, email, phone, farePerKm } = req.body;
    const captainId = req.captain._id;

    if (email && email !== req.captain.email) {
      const existing = await Captain.findOne({ email });
      if (existing && String(existing._id) !== String(captainId)) {
        return res.status(400).json({ message: 'Email is already in use.' });
      }
    }
    if (phone && phone !== req.captain.phone) {
      const existing = await Captain.findOne({ phone });
      if (existing && String(existing._id) !== String(captainId)) {
        return res.status(400).json({ message: 'Phone is already in use.' });
      }
    }

    const updated = await Captain.findByIdAndUpdate(
      captainId,
      {
        ...(fullname?.firstname && { 'fullname.firstname': fullname.firstname }),
        ...(fullname?.lastname  && { 'fullname.lastname':  fullname.lastname }),
        ...(email               && { email }),
        ...(phone               && { phone }),
        ...(farePerKm           && { farePerKm: parseFloat(farePerKm) }),
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'Captain not found' });
    res.json({ success: true, captain: updated });
  } catch (err) {
    console.error('updateCaptainProfile error:', err);
    res.status(500).json({ message: 'Could not update profile' });
  }
};

// ── UPDATE VEHICLE ────────────────────────────────────────────────
const updateCaptainVehicle = async (req, res) => {
  try {
    const { vehicle } = req.body;
    const captainId = req.captain._id;

    if (!vehicle) return res.status(400).json({ message: 'Vehicle data is required' });

    if (vehicle.plate && vehicle.plate !== req.captain.vehicle?.plate) {
      const existing = await Captain.findOne({ 'vehicle.plate': vehicle.plate });
      if (existing && String(existing._id) !== String(captainId)) {
        return res.status(400).json({ message: 'Plate number already registered.' });
      }
    }

    const updated = await Captain.findByIdAndUpdate(
      captainId,
      {
        ...(vehicle.color       && { 'vehicle.color':       vehicle.color }),
        ...(vehicle.plate       && { 'vehicle.plate':       vehicle.plate }),
        ...(vehicle.capacity    && { 'vehicle.capacity':    parseInt(vehicle.capacity) }),
        ...(vehicle.vehicleType && { 'vehicle.vehicleType': vehicle.vehicleType }),
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'Captain not found' });
    res.json({ success: true, captain: updated });
  } catch (err) {
    console.error('updateCaptainVehicle error:', err);
    res.status(500).json({ message: 'Could not update vehicle' });
  }
};

// ── CHANGE PASSWORD ───────────────────────────────────────────────
const changeCaptainPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both fields are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    const captain = await Captain.findById(req.captain._id).select('+password');
    if (!captain) return res.status(404).json({ message: 'Captain not found' });

    const isMatch = await captain.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect.' });

    captain.password = await Captain.hashPassword(newPassword);
    await captain.save();

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    console.error('changeCaptainPassword error:', err);
    res.status(500).json({ message: 'Could not change password' });
  }
};

// ── ALL-TIME RIDE STATS ───────────────────────────────────────────
const getCaptainAllStats = async (req, res) => {
  try {
    const { captainId } = req.params;
    const totalRides = await Ride.countDocuments({
      captain: captainId,
      rideStatus: 'completed',
    });
    res.json({ success: true, totalRides });
  } catch (err) {
    console.error('getCaptainAllStats error:', err);
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

// ── LOGOUT — set status inactive before logging out ───────────────
const logoutCaptain = async (req, res) => {
  try {
    // Set status to inactive so captain doesn't receive new ride requests
    if (req.captain?._id) {
      await Captain.findByIdAndUpdate(req.captain._id, { status: 'inactive' });
    }

    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(' ')[1];

    if (token) {
      await blacklistToken.findOneAndUpdate(
        { token },
        { token },
        { upsert: true, new: true }
      );
    }

    res.clearCookie('token');
    return res.status(200).json({ message: 'Captain logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ message: 'Logout failed' });
  }
};

module.exports = {
  registerCaptain,
  loginCaptain,
  getCaptainProfile,
  updateCaptainStatus,
  updateCaptainProfile,
  updateCaptainVehicle,
  changeCaptainPassword,
  getCaptainAllStats,
  logoutCaptain,
};