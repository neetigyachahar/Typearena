const loadPara = require('../utilities/loadParagraph');

exports.race = (req, res, next)=>{
    loadPara()
        .then( data =>{
            let para = data[0].text.slice(0, 400);
            while(1){
                if(para[para.length-1] == '.' || para[para.length-1] == '!' || para[para.length-1] == '?' || para[para.length-2]+para[para.length-1] == '."' || para.length <= 2){
                    break;
                }
                para = para.slice(0, para.length-1);
            }
            res.render('race', {
                para
            });
        })
        .catch(err => console.log(err));
};