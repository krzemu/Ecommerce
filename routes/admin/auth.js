const express = require('express');
const { check, validationResult } = require('express-validator');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExists, requireValidPasswordForUser } = require('./validators');
const { handleErrors } = require('./middlewares');


const router = express.Router();

// Sign UP LOGIC
router.get('/signup', (req, res) => {
    res.send(signupTemplate({ req }));
});
router.post('/signup', [
    requireEmail,
    requirePassword,
    requirePasswordConfirmation
],
    handleErrors(signupTemplate),
    async (req, res) => {
        const { email, password } = req.body;
        const user = await usersRepo.create({ email, password });
        console.log('user')
        req.session.userID = user.id;
        res.redirect('/admin/products');
    })

// Sign Out LOGIC
router.get('/signout', (req, res) => {
    req.session = null;
    res.redirect('/');
});

// Sign In LOGIC
router.get('/signin', (req, res) => {
    res.send(signinTemplate({}));
});
router.post('/signin', [
    requireEmailExists,
    requireValidPasswordForUser
], handleErrors(signinTemplate),
    async (req, res) => {
        const { email } = req.body;
        const user = await usersRepo.getOneBy({ email });

        req.session.userID = user.id;
        res.redirect('/admin/products');
    });




module.exports = router;