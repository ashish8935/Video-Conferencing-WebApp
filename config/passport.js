const passport = require('passport');
const User = require('../models/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


module.exports = (passport) => {
passport.use(new GoogleStrategy({
     clientID: process.env.GOOGLE_CLIENT_ID,
     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
     callbackURL: "http://localhost:3000/auth/google/callback",
    //  passReqToCallback: true
    },

    async function(request, accessToken, refreshToken, profile, done){
        try{
            let user = await User.findOne({googleId: profile.id});
            if(user){
                done(null, user);
            } else{
               const newUser = {
                googleId: profile.id,
                username: profile.displayName,
                thumbnail: profile.photos[0].value
               };
               user = await User.create(newUser);
               done(null, user);
            }
        } catch (err) {
            console.error(err);
        }
    }
));

    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id).then((user) => {
            done(null, user);
        });
    });
}
