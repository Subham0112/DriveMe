const User = require('../Models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password } = req.body;

  const hashedPassword = await User.hashPassword(password);


    const user = await userService.createUser({
       firstname: fullname.firstname,
       lastname: fullname.lastname,
       email, 
       password: hashedPassword });

    
    
    res.status(201).json({ user });
    console.log("user created");
    

  
}

const loginUser = async (req, res) => {
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
  res.status(200).json({ user, token });
  console.log("user logged in");
};

module.exports = {
  registerUser,
  loginUser
}