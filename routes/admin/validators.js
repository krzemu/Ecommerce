const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
    requirePrice: check('price')
        .trim()
        .escape()
        .replace([','], '.')
        .isFloat()
        .isFloat({ min: 1 })
        .withMessage('Price must be number greater than 1'),
    requireTitle: check('title')
        .trim()
        .isString()
        .withMessage('Title must be text')
        .isLength({ min: 5, max: 40 })
        .escape()
        .withMessage('Must be between 5 and 40 characters'),
    requireEmail: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must be a valid email')
        .custom(async email => {
            const existingUser = await usersRepo.getOneBy({ email });
            if (existingUser) {
                throw new Error('Email in use');
            }
        }),
    requirePassword: check('password')
        .trim()
        .isLength({ min: 5, max: 20 })
        .withMessage('Must be between 5 and 20 characters'),
    requirePasswordConfirmation: check('passwordConfirmation')
        .trim()
        .isLength({ min: 5, max: 20 })
        .withMessage('Must be between 5 and 20 characters')
        .custom(async (passwordConfirmation, { req }) => {
            console.log(passwordConfirmation);
            if (passwordConfirmation !== req.body.password) throw new Error('Password must match');
            else return true;
        }),
    requireEmailExists: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must be a valid email')
        .custom(async email => {
            const user = await usersRepo.getOneBy({ email });
            if (!user) throw new Error('Email not found');
        }),
    requireValidPasswordForUser: check('password')
        .trim()
        .custom(async (password, { req }) => {
            const user = await usersRepo.getOneBy({ email: req.body.email });
            if (!user) throw new Error('Invalid password');
            if (!await usersRepo.comparePasswords(user.password, password)) throw new Error('Invalid passowrd');

        }),
}