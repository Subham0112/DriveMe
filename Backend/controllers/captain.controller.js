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
  const captain = await captainService.createCaptain({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email, 
    password: hashedPassword,
    phone,
    color:vehicle.color,
    plate:vehicle.plate,
    capacity:vehicle.capacity,
    vehicleType:vehicle.vehicleType


  })


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
   res.cookie('token', token);
  res.status(200).json({ captain, token });
  console.log("captain logged in");
}

const getCaptainProfile = async (req, res, next) => {
  res.status(200).json(req.captain)
}
const logoutCaptain = async (req, res, next) => {
  const token=req.cookies?.token || req.headers.authorization?.split(" ")[1];
  await blacklistToken.create({token});
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });

}



module.exports = {
  registerCaptain,
  loginCaptain,
  getCaptainProfile,
  logoutCaptain
};