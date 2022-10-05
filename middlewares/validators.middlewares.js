const { body, validationResult } = require('express-validator');

// Utils
const { AppError } = require('../utils/appError.util');

const checkValidations = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		// [{ ..., msg }] -> [msg, msg, ...] -> 'msg. msg. msg. msg'
		const errorMessages = errors.array().map(err => err.msg);

		const message = errorMessages.join('. ');

		return next(new AppError(message, 400));
	}

	next();
};

const createUserValidators = [
	body('username')
		.isString()
		.withMessage('Name must be a string')
		.notEmpty()
		.withMessage('Name cannot be empty')
		.isLength({ min: 3 })
		.withMessage('Name must be at least 3 characters'),
	body('email').isEmail().withMessage('Must provide a valid email'),
	body('password')
		.isString()
		.withMessage('Password must be a string')
		.notEmpty()
		.withMessage('Password cannot be empty')
		.isLength({ min: 8 })
		.withMessage('Password must be at least 8 characters'),
	checkValidations,
];

const createProductValidations = [
	body('title').notEmpty().withMessage('Title cannot be empty'),
	body('description').notEmpty().withMessage('Description cannot be empty'),
	body('price')
	  .isFloat({ min: 0 })
	  // .custom(val => {
	  //   return val > 0;
	  // })
	  .withMessage('Price must be greater than 0'),
	body('quantity')
	  .isInt({ min: 1 })
	  .withMessage('Quantity must be greater than 0'),
	body('categoryId')
	  .isInt({ min: 1 })
	  .withMessage('Must provide a valid category'),
	  checkValidations,

  ];

module.exports = { createUserValidators ,createProductValidations};
