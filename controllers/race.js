const loadPara = require('../utilities/loadParagraph');

exports.race = (req, res, next)=>{
    res.render('race', {
        logged: req.session.isLoggedIn,
        name: req.session.user.name,
        avgWPM: req.session.user.avgWPM10,
        id: String(req.session.user._id),
        para: req.session.paraData.text,
        author: req.session.paraData.about.author
    });
};