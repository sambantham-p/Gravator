const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Get All User details
router.get('/users', userController.getAllUsers);

// Get User by ID
router.get('/user/:id', userController.getUserById);

// Create a new User
router.post('/user', userController.createUser);

// // Update Specific fields of User by ID
// router.patch('/user/:id', userController.updateUser);

// // Delete User by ID
// router.delete('/user/:id', userController.deleteUser);

module.exports = router;
