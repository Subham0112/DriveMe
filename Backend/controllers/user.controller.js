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

    const token = user.generateAuthToken();
    
    
    res.status(201).json({ user, token });
    console.log("user created");
    

  
}

module.exports = {
  registerUser
}