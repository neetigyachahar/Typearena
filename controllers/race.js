const loadPara = require('../utilities/loadParagraph');

exports.race = (req, res, next)=>{
    loadPara()
        .then( data =>{
            if(req.session.isLoggedIn){
                res.render('race', {
                    logged: req.session.isLoggedIn,
                    name: req.session.user.name,
                    para: data[0].text,
                    author: data[0].about.author
                });
            }else{
                res.render('race', {
                    logged: false,
                    para: data[0].text,
                    author: data[0].about.author
                });
            }
        })
        .catch(err => console.log(err));
};