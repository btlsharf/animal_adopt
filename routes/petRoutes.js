const express = require('express');
const router = express.Router();
const petController = require('../controllers/pet');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', petController.getAllPets);
router.get('/:id', petController.getPet);

// Protected routes
router.get('/new/form', petController.newPetForm);
router.post('/', upload.single('image'), petController.createPet);
router.get('/:id/edit', petController.editPetForm);
router.put('/:id', upload.single('image'), petController.updatePet);
router.delete('/:id', petController.deletePet);

module.exports = router;