const User = require('../models/user');

module.exports = (req, res, next) =>{
    if(req.session.isLoggedIn){
        User
            .findById(req.session.user._id)
            .then(user =>{
                req.session.user = user;
                next();
            })
            .catch(err =>{
                console.log(err);
            })
    }else{
        next();
    }
}