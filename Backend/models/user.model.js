const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname:{
    firstname: {
    type: String,
    required: true,
    minlength: [3, 'firstame must be at least 3 characters long'],
  },
  lastname: {
    type: String,
    required: true,
    minlength: [3, 'lastname must be at least 3 characters long'],
  }
},
  
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  socketId: {
    type: String,
  },
});

userSchema.methods.generateAuthToken = function() {
  const token= jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  return token;
}

userSchema.methods.comparePassword = async function(password) { 
  return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function(password) {
  return await bcrypt.hash(password, 10);
}


const User = mongoose.model('user', userSchema);

module.exports = User;