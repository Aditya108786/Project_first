//
// models/fasting.model.js
const mongoose = require('mongoose');

const fastingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  }
});

const FastingModel = mongoose.model('Fasting', fastingSchema);
module.exports = FastingModel;

