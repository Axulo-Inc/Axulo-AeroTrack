const { body } = require('express-validator');

const validateRegistration = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone().withMessage('Please enter a valid phone number')
];

const validateLogin = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const validateAircraft = [
  body('registration').notEmpty().withMessage('Registration is required'),
  body('type').notEmpty().withMessage('Aircraft type is required'),
  body('manufacturer').notEmpty().withMessage('Manufacturer is required'),
  body('model').notEmpty().withMessage('Model is required')
];

const validateDefect = [
  body('aircraft').notEmpty().withMessage('Aircraft ID is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('severity').isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Invalid severity')
];

const validateMaintenance = [
  body('aircraft').notEmpty().withMessage('Aircraft ID is required'),
  body('task').notEmpty().withMessage('Task description is required'),
  body('scheduledDate').isISO8601().withMessage('Valid scheduled date is required')
];

const validateInventory = [
  body('partNumber').notEmpty().withMessage('Part number is required'),
  body('name').notEmpty().withMessage('Part name is required'),
  body('category').notEmpty().withMessage('Category is required')
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateAircraft,
  validateDefect,
  validateMaintenance,
  validateInventory
};
