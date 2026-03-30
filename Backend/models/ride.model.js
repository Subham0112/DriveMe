const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rideSchema = new Schema(
{
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },

  captain: {
    type: Schema.Types.ObjectId,
    ref: 'captain',
    default: null
  },

  pickup: {
    address: {
      type: String,
      required: true
    },
    latitude: Number,
    longitude: Number
  },

  drop: {
    address: {
      type: String,
      required: true
    },
    latitude: Number,
    longitude: Number
  },

  fare: {
    type: Number,
    required: true
  },

  distance: {
    type: Number   // in km (optional but useful)
  },

  duration: {
    type: Number   // in minutes (optional)
  },

  rideStatus: {
    type: String,
    enum: [
      'pending',     // user created ride
      'accepted',    // captain accepted
      'ongoing',     // ride started
      'completed',   // ride finished
      'cancelled'
    ],
    default: 'pending'
  },

  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  rideDate:{
    type: Date,
    default: Date.now
  }

},
{ timestamps: true }
);

const Ride = mongoose.model('ride', rideSchema);

module.exports = Ride;