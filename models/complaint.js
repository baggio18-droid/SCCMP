const mongoose = require('mongoose');

// Define the schema for the complaint model
const complaintSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  transactionNumber: {
    type: String,
    default: ''
  },
  complaintDescription: {
    type: String,
    required: true
  },
  predictedCategory: {
    type: String, // Adjust the data type based on the type of predicted category
    required: true,
  },
  status: {
    type: String,
    default: 'Pending'
  },
  solved: {
    type: Boolean,
    default: false,
  }
});

// Create the complaint model from the schema
const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
