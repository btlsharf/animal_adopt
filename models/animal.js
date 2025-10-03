const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
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
    max: 30
  },
  ageUnit: {
    type: String,
    enum: ['months', 'years'],
    default: 'years'
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown'],
    required: true
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large', 'extra-large'],
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
  adoptionFee: {
    type: Number,
    min: 0,
    default: 0
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
  }
});

const Animal = mongoose.model('Animal', animalSchema);

module.exports = Animal;
