const User = require('../models/user');
const brcypt = require('bcryptjs');

exports.signup = (req, res, next)=>{
    const name  = req.body.name;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    brcypt
    .hash(password, 12)
    .then((hashedPassword) => {
        // console.trace(hashedPassword);
            const newUser = new User({
                name,
                username,
                email,
                password: hashedPassword
            });
            newUser
                .save()
                .then(result =>{
                    console.log('result');
                    res.json({
                        message: `Welcome ${result.name}!`,
                        redirect: true
                    });
                });
        })
        .catch((err) => {
            console.log(err);
        });
}

exports.login = (req, res, next)=>{
    const username = req.body.username;
    const password = req.body.password;
    User
        .findOne({username})
        .then(user =>{
            if(!user){
                res.json({
                    message: `Invalid username: ${username}`
                });
            }else{
                brcypt
                    .compare(password, user.password)
                    .then(match =>{
                        if(!match){
                            res.json({
                                message: `Invalid password`
                            });
                        }else{
                            req.session.isLoggedIn = true;
                            req.session.user = user;
                            res.json({
                                message: `Welcome ${user.name}!`,
                                redirect: true
                            });
                        }
                    })
            }
        })
}

exports.logout = (req, res, next)=>{
    req.session.destroy();
    res.redirect('/');
}

exports.profile = (req, res, next) =>{
    res.render('profile', {
        logged: req.session.isLoggedIn,
        name: req.session.user.name
    });
}