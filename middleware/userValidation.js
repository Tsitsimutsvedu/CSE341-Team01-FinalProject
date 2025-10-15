const { param, body } = require('express-validator');

// Validate MongoDB ObjectId in route parameter
exports.validateUserId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID'),
];

// Validate user body fields
exports.validateUserBody = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),

  body('email')
    .isEmail()
    .withMessage('Valid email is required'),

  body('roles')
    .optional()
    .isArray()
    .withMessage('Roles must be an array'),

  body('googleId')
    .optional()
    .isString()
    .withMessage('Google ID must be a string'),

  // Avoid using isURL due to known vulnerability
  body('profilePicture')
    .optional()
    .custom((value) => {
      try {
        new URL(value);
        return true;
      } catch {
        throw new Error('Profile picture must be a valid URL');
      }
    }),
];

