const express = require('express');
const router = express.Router();
const Pet = require('../models/pet');
const User = require('../models/user');

// Get all pets
router.get('/', async (req, res) => {
  try {
        const { species, status, search } = req.query;
        let query = {};
        if (species && species !== 'all') {
            query.species = species;
        }
        if (status && status !== 'all') {
            query.status = status;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { breed: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        const pets = await Pet.find(query)
            .populate('owner', 'username')
            .sort({ createdAt: -1 });
        
        res.render('pets/index', { 
            pets, 
            filters: { species, status, search }
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error loading pets');
        res.redirect('/');
    }
});

// Show single pet
router.get('/:petId', async (req, res) => {
  try {
        const pet = await Pet.findById(req.params.id).populate('owner', 'username email');
        if (!pet) {
            req.flash('error', 'Pet not found');
            return res.redirect('/pets');
        }
        let isFavorite = false;
        if (req.session.user) {
            const user = await User.findById(req.session.user._id);
            isFavorite = user.favorites.includes(pet._id);
        }
        res.render('pets/show', { pet, isFavorite });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error loading pet details');
        res.redirect('/pets');
    }
});

router.get('/new', (req, res) => {
  res.render('pets/new');
});


// Create new pet
router.post('/', async (req, res) => {
    try{
        const { name, species, breed, age, gender, description, isVaccinated, isSpayedNeutered, status } = req.body;

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

// Show edit form
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

// Update pet
router.post('/:petId', async (req, res) => {
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
        const { name, species, breed, age, gender, description, isVaccinated, isSpayedNeutered, status } = req.body;
        pet.name = name;
        pet.species = species;
        pet.breed = breed;
        pet.age = age;
        pet.gender = gender;
        pet.description = description;
        pet.isVaccinated = isVaccinated;
        pet.isSpayedNeutered = isSpayedNeutered;
        pet.status = status;
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

// Delete pet
router.post('/:petId/delete', async (req, res) => {
    try{
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
