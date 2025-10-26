const jwt = require('jsonwebtoken');
const User = require('../Models/user.model');
const bcrypt = require('bcrypt');

  const authUser= async (req, res, next) => {
    const token=req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if(!token){
      return res.status(401).json({message:"Unauthorized user"});
    }

    const isBlacklisted=await User.findOne({token:token});
    if(isBlacklisted){
      return res.status(401).json({message:"Unauthorized user"});
    }

    try{
      const decoded=jwt.verify(token,process.env.JWT_SECRET);
      const user=await User.findById(decoded._id);
      if(!user){
        return res.status(401).json({message:"Unauthorized user with this credentials"});
      }
      req.user=user;
      next();
    }catch(err){
      return res.status(401).json({message:"Unauthorized user"});
    }
  }

  module.exports={
    authUser
  };