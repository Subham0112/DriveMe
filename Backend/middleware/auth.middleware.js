const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Captain = require('../models/captain.model');
const bcrypt = require('bcrypt');
const blacklistToken = require('../models/tokenBacklist.model');


  const authUser= async (req, res, next) => {
    const token=req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if(!token){
      return res.status(401).json({message:"Unauthorized user"});
    }

    const isBlacklisted=await blacklistToken.findOne({token:token});
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

  const authCaptain= async (req, res, next) => {
    const token=req.cookies?.CaptainToken || req.headers.authorization?.split(" ")[1];
    if(!token){
      return res.status(401).json({message:"Unauthorized captain"});
    }

    const isBlacklisted=await blacklistToken.findOne({token:token});
    if(isBlacklisted){
      return res.status(401).json({message:"Unauthorized "});
    }

    try{
      const decoded=jwt.verify(token,process.env.JWT_SECRET);
      const captain=await Captain.findById(decoded._id);
      if(!captain){
        return res.status(401).json({message:"Unauthorized  with this credentials"});
      }
      req.captain=captain;
      next();
    }catch(err){
      return res.status(401).json({message:"Unauthorized "});
    }
  }

  module.exports={
    authUser,
    authCaptain
  };