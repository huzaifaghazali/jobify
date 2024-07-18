import { body, validationResult } from 'express-validator';
import { BadRequestError } from '../errors/customErrors.js';
import { JOB_STATUS, JOB_TYPE } from '../utils/constants.js';

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

export const validateJobInput = withValidationErrors([
  body('company').notEmpty().withMessage('Company is required'),
  body('position').notEmpty().withMessage('Position is required'),
  body('jobLocation').notEmpty().withMessage('Job location is required'),
  body('jobStatus')
    .isIn(Object.values(JOB_STATUS))
    .withMessage('Invalid status value'),
  body('jobType').isIn(Object.values(JOB_TYPE)).withMessage('Invalid job type'),
]);
