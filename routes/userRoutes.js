const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');


router.get('/show', userController.getProfile);
router.get('/show/edit', userController.editProfileForm);
router.put('/show', userController.updateProfile);
router.get('/my-pets', userController.getMyPets);

module.exports = router;