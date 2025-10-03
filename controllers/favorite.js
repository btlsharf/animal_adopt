const User = require('../models/user');
const Pet = require('../models/pet');

// Get all favorites
exports.getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id)
            .populate({
                path: 'favorites',
                populate: { path: 'owner', select: 'username' }
            });
        res.render('user/favorites', { favorites: user.favorites });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error loading favorites');
        res.redirect('/pets');
    }
};

// Add to favorites
exports.addFavorite = async (req, res) => {
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
};

// Remove from favorites
exports.removeFavorite = async (req, res) => {
    try {
        const petId = req.params.id;
        const user = await User.findById(req.session.user._id);
        user.favorites = user.favorites.filter(
            fav => fav.toString() !== petId
        );
        await user.save();
        req.flash('success', 'Removed from favorites');
        const referer = req.get('referer') || '/favorites';
        res.redirect(referer);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error removing from favorites');
        res.redirect('/favorites');
    }
};