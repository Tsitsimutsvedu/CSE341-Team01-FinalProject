
const express = require('express');
const router = express.Router();
const { upgradeToAdmin, Allusers } = require('../controllers/users.controller');
const { verifyGoogleToken } = require('../middleware/VerifyGoogleToken');
const { authorizeAdminOrEmployee, authorizeAdminOnly } = require('../middleware/auth');
const validationRequests = require('../middleware/validationRequests');
const { validateUserId, validateUserBody } = require('../middleware/userValidation');
const User = require('../models/user');

// Get all users (protected)
router.get('/', verifyGoogleToken, authorizeAdminOrEmployee, Allusers);

// Get a user by ID (protected)
router.get('/:id', verifyGoogleToken, authorizeAdminOrEmployee, validateUserId, validationRequests, async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) return res.status(404).json({ message: 'User not found' });
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Create a new user (open, or you can protect if needed)
router.post('/', validateUserBody, validationRequests, async (req, res) => {
	/*
    #swagger.tags = ['Users']
    #swagger.summary = 'Create a new user'
    #swagger.description = 'Creates a new user.'
    */
	try {
		const user = new User(req.body);
		await user.save();
		res.status(201).json(user);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// Update a user (admin only) - Tyler implemented but commenting for reference
router.put('/:id', verifyGoogleToken, authorizeAdminOnly, [...validateUserId, ...validateUserBody], validationRequests, async (req, res) => {
	/*
    #swagger.tags = ['Users']
    #swagger.summary = 'Update user by ID'
    #swagger.description = 'Updates a user by its ID.'
    */
	try {
		const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!user) return res.status(404).json({ message: 'User not found' });
		res.status(200).json(user);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// Delete a user (admin only) - Tyler implemented but commenting for reference
router.delete('/:id', verifyGoogleToken, authorizeAdminOnly, validateUserId, validationRequests, async (req, res) => {
	/*
    #swagger.tags = ['Users']
    #swagger.summary = 'Delete user by ID'
    #swagger.description = 'Deletes a user by its ID.'
    */
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user) return res.status(404).json({ message: 'User not found' });
		res.status(200).json({ message: 'User deleted successfully' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Upgrade role (protected)
router.post('/upgrade-role', verifyGoogleToken, upgradeToAdmin);

module.exports = router;
