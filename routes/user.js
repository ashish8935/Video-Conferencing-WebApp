const express = require('express');
const passport = require('passport');
const router = express.Router();
const {ensureAuth, ensureGuest} = require('../middleware/auth');


router.get('/', ensureGuest, (req, res, next) => {
    res.render('login');
    });
    
    router.get('/google',
      passport.authenticate('google', { scope: ['email', 'profile'] }));
    
    router.get('/google/callback', 
      passport.authenticate('google', { 
        failureRedirect: '/login',
        successRedirect: '/index'
     })
    )
        

        router.get('/logout', (req, res, next) => {
            req.logout(function (err) {
              if (err) {
                console.error('Error logging out:', err);
                return next(err);
              }
              res.redirect('/auth'); // Redirect after successful logout
            });
          });

module.exports = router;

