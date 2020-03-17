module.exports = data =>{
    let para = [];
    return new Promise(cb =>{
        data.forEach(d => {
            if(!d.title){
                d.title = null;
            }
            if(!d.Author){
                d.author = null;
            }
            para.push({
                text: d.text,
                about:{
                    title: d.title,
                    author: d.Author
                },
                avgSpeed: 0,
                races: 0,
                topSpeed:{
                    speed: 0
                }
            });
        });

        cb(para);
    });
};