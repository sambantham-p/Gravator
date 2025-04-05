const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  emailAddress: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: false,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  gravatar: {
    type: String,
    required: false,
  },
  joinOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
