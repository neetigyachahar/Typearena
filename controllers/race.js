const loadPara = require('../utilities/loadParagraph');

exports.race = (req, res, next)=>{
    loadPara()
        .then( data =>{
            res.render('race', {
                para: data[0].text,
                author: data[0].about.author
            });
        })
        .catch(err => console.log(err));
};