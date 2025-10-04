const express = require('express');
const router = express.Router();
const Pet = require('../models/pet');
const User = require('../models/user');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

// 1. Get all pets
router.get('/', async (req, res) => {
  const pets = await Pet.find().populate('owner', 'username').sort({ createdAt: -1 });
  res.render('pets/index', { pets, filters: {} });
});

// 2. Show new pet form
router.get('/new', (req, res) => {
  res.render('pets/new');
});

// 3. Create new pet
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, species, breed, age, gender, description, status } = req.body;

    const isVaccinated = req.body.isVaccinated === 'on';
    const isSpayedNeutered = req.body.isSpayedNeutered === 'on';

    const petData = {
      name,
      species,
      breed,
      age,
      gender,
      description,
      isVaccinated,
      isSpayedNeutered,
      status,
      owner: req.session.user._id
    };

    if (req.file) {
      petData.imageUrl = '/uploads/' + req.file.filename;
    }

    const pet = await Pet.create(petData);

    req.flash('success', 'Pet listed successfully!');
    res.redirect(`/pets/${pet._id}`);
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error creating pet');
    res.redirect('/pets/new');
  }
});

// 4. Show edit form
router.get('/:petId/edit', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.petId);
    if (!pet) {
      req.flash('error', 'Pet not found');
      return res.redirect('/pets');
    }
    if (pet.owner.toString() !== req.session.user._id.toString()) {
      req.flash('error', 'You do not have permission to edit this pet');
      return res.redirect(`/pets/${pet._id}`);
    }
    res.render('pets/edit', { pet });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading edit form');
    res.redirect('/pets');
  }
});

// 🔽 5. ⬅️ PUT route goes HERE
router.put('/:petId', upload.single('image'), async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.petId);
    if (!pet) {
      req.flash('error', 'Pet not found');
      return res.redirect('/pets');
    }
    if (pet.owner.toString() !== req.session.user._id.toString()) {
      req.flash('error', 'You do not have permission to edit this pet');
      return res.redirect(`/pets/${pet._id}`);
    }

    const { name, species, breed, age, gender, description, status } = req.body;

    const isVaccinated = req.body.isVaccinated === 'on';
    const isSpayedNeutered = req.body.isSpayedNeutered === 'on';

    pet.name = name;
    pet.species = species;
    pet.breed = breed;
    pet.age = age;
    pet.gender = gender;
    pet.description = description;
    pet.status = status;
    pet.isVaccinated = isVaccinated;
    pet.isSpayedNeutered = isSpayedNeutered;

    if (req.file) {
      pet.imageUrl = '/uploads/' + req.file.filename;
    }

    await pet.save();
    req.flash('success', 'Pet updated successfully!');
    res.redirect(`/pets/${pet._id}`);
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error updating pet');
    res.redirect('/pets');
  }
});

// 6. Show pet details
router.get('/:petId', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.petId).populate('owner', 'username email');
    if (!pet) {
      req.flash('error', 'Pet not found');
      return res.redirect('/pets');
    }
    let isFavorite = false;
    if (req.session.user) {
      const user = await User.findById(req.session.user._id);
      isFavorite = user.favorites.includes(pet._id);
    }
    res.render('pets/show', { pet, isFavorite, currentUser: req.session.user });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading pet details');
    res.redirect('/pets');
  }
});

// 7. Delete pet
router.post('/:petId/delete', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.petId);
    if (!pet) {
      req.flash('error', 'Pet not found');
      return res.redirect('/pets');
    }
    if (pet.owner.toString() !== req.session.user._id.toString()) {
      req.flash('error', 'You do not have permission to delete this pet');
      return res.redirect(`/pets/${pet._id}`);
    }
    await Pet.findByIdAndDelete(req.params.petId);
    await User.updateMany(
      { favorites: pet._id },
      { $pull: { favorites: pet._id } }
    );
    req.flash('success', 'Pet deleted successfully');
    res.redirect('/user/my-pets');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error deleting pet');
    res.redirect('/pets');
  }
});

module.exports = router;
