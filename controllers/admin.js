const paragraph = require("../models/paragraph");
const dataShape = require("../utilities/datasetShape");

exports.datasetPage = (req, res, next)=>{
    res.render('adminDataset');
};

exports.uploadDataset = (req, res, next)=>{
    let data = JSON.parse(req.file.buffer.toString());

    dataShape(data)
      .then(result =>{
        paragraph.collection.insertMany(result, (err, docs)=>{
          if(err) {
            return res.redirect('/admin/dataset?message=This data already exists');
          }
          res.redirect('/admin/dataset?message=Successfully added');
        });
      })
      .catch(err =>{
        console.log(err);
      });
};
