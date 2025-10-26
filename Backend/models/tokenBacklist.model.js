const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tokenBacklistSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86000, // Token will be removed after 24 hours
  },

});

const TokenBacklist = mongoose.model('TokenBacklist', tokenBacklistSchema);

module.exports = TokenBacklist;