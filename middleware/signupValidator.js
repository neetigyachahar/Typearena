const user = require('../models/user');

exports.email = (req, res, next)=>{
    console.log('Howdy!');
    user
        .findOne({email: req.body.email})
        .then(user => {
            console.log(user);
            if(user){
                res.json({
                    message: "email ID is already registered."
                });
            }else{
                next();
            }
        }).catch((err) => {
            if (err)  console.log(err);
        });
}

exports.username = (req, res, next)=>{
    user
        .findOne({username: req.body.username})
        .then((user) => {
            if(user){
                res.json({
                    message: "Username already exists, choose another."
                });
            }else{
                next();
            }
        }).catch((err) => {
            if (err)  console.log(err);
        });
}