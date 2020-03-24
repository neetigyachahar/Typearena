const path = require('path');

const express = require('express');
const router = express.Router();

const user = require('../controllers/user'); 

const signVaild = require('../middleware/signupValidator');
const loginVerify = require('../middleware/loginVerify');
const raceOrganiser = require('../backendService/raceOrganiser');


router.get('/', (req, res, next)=>{
    if(req.session.isLoggedIn){
        res.render('home', {
            logged: req.session.isLoggedIn,
            name: req.session.user.name,
            avgWPM: req.session.user.avgWPM10
        });
    }else{
        res.render('home', {
            logged: false
        });
    }
});

router.get('/profile', loginVerify('Login to see your profile! <br>or signup to get started! :)'), user.profile);

router.post('/signup', signVaild.email, signVaild.username, user.signup);
router.post('/login', user.login);
router.get('/logout', loginVerify('No user is logged in!'), raceOrganiser.disconnectThroughLogout, user.logout);

module.exports = router;