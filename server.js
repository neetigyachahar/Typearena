//Importing modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const adminRoutes = require('./routes/admin');
const raceCon = require('./controllers/race.js');
const app = express();
const MONGODB_URI = "mongodb+srv://neetigya:pvx8RHA8CQb8O07l@cluster0-gdzqa.mongodb.net/test?retryWrites=true&w=majority"


//Initailising utilities
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));


app.use('/admin', adminRoutes);

app.get('/race', raceCon.race);

app.all('/', (req, res, next)=>{
    res.render('home');
});

//Connected Database and start listening
mongoose
  .connect(MONGODB_URI, {useUnifiedTopology: true,  useCreateIndex: true, useNewUrlParser: true})
  .then(result => {
    app.listen(process.env.PORT || 5000,()=>{
        console.log('Server is ready to rock!');
    });
  })
  .catch(err => {
    console.log(err);
  });