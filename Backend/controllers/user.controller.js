const User = require('../models/user.model');
const userService = require('../services/user.service');
const blacklistToken=require('../models/tokenBacklist.model');
const { validationResult } = require('express-validator');

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password } = req.body;

  const FindUser = await User.findOne({ email });
  if (FindUser) {
    return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
  }

  const hashedPassword = await User.hashPassword(password);


    const user = await userService.createUser({
       firstname: fullname.firstname,
       lastname: fullname.lastname,
       email, 
       password: hashedPassword });

    
    
    res.status(201).json({ user });
    console.log("user created");
    

  
}

const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ errors: [{ msg: 'Invalid email or password' }] });
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return res.status(401).json({ errors: [{ msg: 'Invalid email or password' }] });
  }
  const token = user.generateAuthToken();
   res.cookie('token', token);

  res.status(200).json({ user, token });
  console.log("user logged in");
};  


const getUserProfile = async (req, res, next) => {
  res.status(200).json(req.user)
};

const logoutUser = async (req, res, next) => {
  const token=req.cookies?.token || req.headers.authorization?.split(" ")[1];
  await blacklistToken.create({token});
  res.clearCookie('token');

  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser
}