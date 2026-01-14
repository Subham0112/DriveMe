const Captain = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
const blacklistToken=require('../models/tokenBacklist.model');

const registerCaptain = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullname, email, password, phone,vehicle} = req.body;

  const Findcaptain = await Captain.findOne({ email });
  if (Findcaptain) {
    return res.status(400).json({ errors: [{ msg: 'Captain already exists' }] });
  }

  const hashedPassword = await Captain.hashPassword(password);
   // Create captain - pass vehicle as object
    const captain = await captainService.createCaptain({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email, 
      password: hashedPassword,
      phone,
      vehicle: vehicle  
    });
  res.status(201).json({ captain});
  console.log("captain created");





}

const loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const captain = await Captain.findOne({ email }).select('+password');
  if (!captain) {
    return res.status(401).json({ errors: [{ msg: 'Invalid email or password' }] });
  }
  const isPasswordMatch = await captain.comparePassword(password);
  if (!isPasswordMatch) {
    return res.status(401).json({ errors: [{ msg: 'Invalid email or password' }] });
  }
  const token = captain.generateAuthToken();
   res.cookie('token', token, {
  httpOnly: true,
  secure: false,      // true in production (HTTPS)
  sameSite: 'lax'
   });
  res.status(200).json({ captain, token });
  console.log("captain logged in");
}

const getCaptainProfile = async (req, res, next) => {
  res.status(200).json(req.captain)
}
const logoutCaptain= async (req, res) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (token) {
      await blacklistToken.findOneAndUpdate(
        { token },
        { token },
        { upsert: true, new: true }
      );
    }

    res.clearCookie("token");
    return res.status(200).json({ message: "captain Logged out successfully" });

  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Logout failed" });
  }
};




module.exports = {
  registerCaptain,
  loginCaptain,
  getCaptainProfile,
  logoutCaptain
};