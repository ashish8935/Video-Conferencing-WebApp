module.exports = {
    ensureAuth: (req, res, next) => {
        if(req.isAuthenticated()){
            console.log('lalit');
            return next();
        } else{
            console.log('mota');
            return res.redirect('/auth');
        }
    },

    ensureGuest: (req, res, next) => {
        if(req.isAuthenticated()){
            console.log('ashish');
            return res.redirect('/dashboard');
        } else{
            console.log('handsome');
            next();
        }
    },
}