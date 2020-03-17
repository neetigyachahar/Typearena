module.exports = function (msg){
    return function (req, res, next){
        if(req.session.isLoggedIn){
            next();
        }else{
            res.render('error', {
                msg,
                logged: false
            });
        }
    }
}