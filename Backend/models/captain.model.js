const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const captainSchema = new Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, 'firstname must be at least 3 characters long'],
    },
    lastname: {
      type: String,
      required: true,
    },
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    // match: [
    //   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    //   'Please enter a valid email address',
    // ],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    // minlength: [10, 'phone number must be at least 10 characters long'],
  },

  socketId: {
    type: String,
    default: null,
  },
  status:{
    type:String,
    enum:['active','inactive'],
    default:'inactive' 
  },
  vehicle: {
    color:{
      type: String,
      required: true,

    },
    plate:{
      type: String,
      required: true,
      unique: true,
      minlength: [4, 'plate number must be at least 4 characters long'],
    },
    capacity:{
      type: Number,
      required: true,
      min: [1, 'capacity must be at least 1 people'],
    },
    vehicleType:{
      type: String,
      required: true,
      enum:['car','motorcycle','scooter','auto-rickshaw'],
      default:'car'
    },

  },
  farePerKm:{
    type: Number,
    required: true,
    default: 20
  },
  location:{
    latitude:{
      type: Number
    },
    longitude:{
      type: Number
    }
  },
  dateJoined: {
    type: Date,
    default: Date.now
  }
});

captainSchema.methods.generateAuthToken = function() {
  const token= jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  return token;
}

captainSchema.methods.comparePassword = async function(password) { 
  return await bcrypt.compare(password, this.password);
}

captainSchema.statics.hashPassword = async function(password) {
  return await bcrypt.hash(password, 10);
}

const Captain = mongoose.model('captain', captainSchema);

module.exports = Captain;