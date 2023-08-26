const passport = require('passport');
const express = require('express');
const {ensureAuth, ensureGuest} = require('../middleware/auth');
const router = express.Router();

router.get('/', ensureAuth, (req, res, next) =>{
    res.render('profile', {user: req.user});
});

router.get('/dashboard', ensureAuth,  (req, res, next) =>{
    res.render('dashboard');
});

module.exports = router;