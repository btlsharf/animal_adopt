const User = require('../models/user');
const Pet = require('../models/pet');

// Get user profile
exports.getProfile = async (req, res) => {
    const user = await User.findById(req.session.user._id);
    res.render('users/show', { user });
};

// Show edit profile form
exports.editProfileForm = async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        res.render('users/edit', { user });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error loading edit form');
        res.redirect('/users/show');
    }
};

// Update profile
exports.updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findById(req.session.user._id);
        if (username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                req.flash('error', 'Username already taken');
                return res.redirect('/users/show/edit');
            }
        }
        if (email !== user.email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                req.flash('error', 'Email already in use');
                return res.redirect('/user/show/edit');
            }
        }
        user.username = username;
        user.email = email;
        await user.save();
        
        req.session.user.username = username;
        req.session.user.email = email;
        
        req.flash('success', 'Profile updated successfully');
        res.redirect('/user/show');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error updating profile');
        res.redirect('/users/show/edit');
    }
};

//show users pets
exports.getMyPets = async (req, res) => {
    try {
        const pets = await Pet.find({ owner: req.session.user._id })
        res.render('user/my-pets', { pets });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error loading your pets');
        res.redirect('/pets');
    }
};