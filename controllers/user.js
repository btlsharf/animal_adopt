const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Pet = require('../models/pet');

// Get user profile
router.get('/show', async (req, res) => {
    try{
        const user = await User.findById(req.session.user._id);
        res.render('users/show', { user });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error loading profile');
        return res.redirect('/pets');
    }
});

// Show user's favorite pets
router.get('/favorites', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id).populate('favorites');
    res.render('users/favorites', { favorites: user.favorites });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading favorites');
    res.redirect('/pets');
  }
});

// Add pet to favorites
router.post('/favorites/:id', async (req, res) => {
  try {
    const petId = req.params.id;
    const pet = await Pet.findById(petId);
    if (!pet) {
      req.flash('error', 'Pet not found');
      return res.redirect('/pets');
    }
    const user = await User.findById(req.session.user._id);
    if (user.favorites.includes(petId)) {
      req.flash('error', 'Pet already in favorites');
      return res.redirect(`/pets/${petId}`);
    }
    user.favorites.push(petId);
    await user.save();
    req.flash('success', 'Added to favorites!');
    res.redirect(`/pets/${petId}`);
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error adding to favorites');
    res.redirect('/pets');
  }
});

// Remove pet from user's favorites
router.delete('/favorites/:id', async (req, res) => {
  try {
    const petId = req.params.id;
    const user = await User.findById(req.session.user._id);

    user.favorites = user.favorites.filter(favId => favId.toString() !== petId);
    await user.save();

    req.flash('success', 'Removed from favorites');
    res.redirect(`/pets/${petId}`);
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error removing from favorites');
    res.redirect('/pets');
  }
});


// Show edit profile form
router.get('/show/edit', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    res.render('users/edit', { user });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading edit form');
    res.redirect('/users/show');
  }
});

// Update profile
router.put('/profile', async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.session.user._id);

    if (username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        req.flash('error', 'Username already taken');
        return res.redirect('/users/profile/edit');
      }
    }

    if (email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        req.flash('error', 'Email already in use');
        return res.redirect('/users/profile/edit');
      }
    }

    user.username = username;
    user.email = email;
    await user.save();

    req.session.user.username = username;
    req.session.user.email = email;

    req.flash('success', 'Profile updated successfully');
    res.redirect('/users/show');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error updating profile');
    res.redirect('/users/show/edit');
  }
});


// Show user's pets
router.get('/my-pets', async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.session.user._id });
    res.render('users/my-pets', { pets });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading your pets');
    res.redirect('/pets');
  }
});

module.exports = router;
