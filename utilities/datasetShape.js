module.exports = data =>{
    let para = [];
    return new Promise(cb =>{
        data.forEach(d => {
            para.push({
                text: d.description,
                about:{
                    title: d.title,
                    url: d.url,
                    author: d.author,
                    publisher: d.publisher,
                    customer_review_count: d.customer_reviews,
                    stars: d.stars
                },
                abgSpeed: 0,
                races: 0,
                topSpeed:{
                    speed: 0
                }
            });
        });

        cb(para);
    });
};