import { body, validationResult } from 'express-validator';
export const userSignupValidator = [
    body('name')
        .notEmpty()
        .withMessage('Name is required'),
    body('email')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({ min: 4, max: 32 })
        .withMessage('Email must be between 4 to 32 characters'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number'),
    // middleware to handle errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const firstError = errors.array()[0].msg;
            return res.status(400).json({ error: firstError });
        }
        next();
    }
];
