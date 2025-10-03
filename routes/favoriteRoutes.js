const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite');

router.get('/', favoriteController.getFavorites);
router.post('/:id', favoriteController.addFavorite);
router.delete('/:id', favoriteController.removeFavorite);

module.exports = router;