const User = require('../models/user.model');
const userService = require('../services/user.service');
const blacklistToken = require('../models/tokenBacklist.model');
const { validationResult } = require('express-validator');
const Ride = require('../models/ride.model');

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password } = req.body;

  const FindUser = await User.findOne({ email });
  if (FindUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await User.hashPassword(password);

  const user = await userService.createUser({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
  });

  res.status(201).json({ user });
  console.log("user created");
};

const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const token = user.generateAuthToken();
  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  });
  res.status(200).json({ user, token });
  console.log("user logged in");
};

const getUserProfile = async (req, res, next) => {
  res.status(200).json(req.user);
};

// ── UPDATE PROFILE ─────────────────────────────────────────────────────────────
const updateUserProfile = async (req, res) => {
  try {
    const { fullname, email } = req.body;
    const userId = req.user._id;

    // If email is changing, ensure it's not taken by another user
    if (email && email !== req.user.email) {
      const existing = await User.findOne({ email });
      if (existing && String(existing._id) !== String(userId)) {
        return res.status(400).json({ message: 'Email is already in use by another account.' });
      }
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      {
        ...(fullname?.firstname && { 'fullname.firstname': fullname.firstname }),
        ...(fullname?.lastname  && { 'fullname.lastname':  fullname.lastname }),
        ...(email               && { email }),
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'User not found' });

    res.json({ success: true, user: updated });
  } catch (err) {
    console.error('updateUserProfile error:', err);
    res.status(500).json({ message: 'Could not update profile' });
  }
};

// ── CHANGE PASSWORD ────────────────────────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    // Fetch user with password field (normally excluded)
    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    user.password = await User.hashPassword(newPassword);
    await user.save();

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    console.error('changePassword error:', err);
    res.status(500).json({ message: 'Could not change password' });
  }
};

// ── RIDE COUNT ────────────────────────────────────────────────────────────────
const getUserRideCount = async (req, res) => {
  try {
    const count = await Ride.countDocuments({
      user: req.user._id,
      rideStatus: 'completed',
    });
    res.json({ success: true, count });
  } catch (err) {
    console.error('getUserRideCount error:', err);
    res.status(500).json({ message: 'Could not fetch ride count' });
  }
};

const logoutUser = async (req, res) => {
  try {
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
    return res.status(200).json({ message: 'user Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ message: 'Logout failed' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserRideCount,
  logoutUser,
};