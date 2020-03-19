const loadPara = require('../utilities/loadParagraph');

exports.race = (req, res, next)=>{
    loadPara()
        .then( data =>{
            res.render('race', {
                logged: req.session.isLoggedIn,
                name: req.session.user.name,
                id: req.session.user._id,
                para: data[0].text,
                author: data[0].about.author
            });
        })
        .catch(err => console.log(err));
};