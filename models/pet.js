const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  species: {
    type: String,
    required: true,
    enum: ['dog', 'cat', 'bird', 'rabbit', 'other']
  },
  breed: {
    type: String,
    maxlength: 50
  },
  age: {
    type: Number,
    required: true,
    min: 0,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown'],
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  isVaccinated: {
    type: Boolean,
    default: false
  },
  isSpayedNeutered: {
    type: Boolean,
    default: false
  },
  imageUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'adopted'],
    default: 'available'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
      type: Date,
      default: Date.now
  }
});

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
