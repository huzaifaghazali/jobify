import { body, validationResult } from 'express-validator';
import { BadRequestError } from '../errors/customErrors';

const withValidationErrors = (validateValues) => {
  return [
    // The validation function to be checked
    validateValues,
    // A function that checks for validation errors and calls next() if there are none, otherwise throws a BadRequestError
    (req, res, next) => {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // If there are validation errors, create an array of all the error messages
        const errorMessages = errors.array().map((error) => error.msg);
        // Throw a BadRequestError with all the error messages
        next(new BadRequestError(errorMessages));
      }
      // If there are no validation errors, call next() to proceed to the next middleware function
      next();
    },
  ];
};

export const validateTest = withValidationErrors([
  body('name')
    .notEmpty()
    .withMessage('name is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('name must be between 3 and 50 characters long')
    .trim(),
]);
