const mongoose = require('mongoose');

const sentEmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const SentEmail = mongoose.model('SentEmail', sentEmailSchema, 'sentemails' );

module.exports = SentEmail;
