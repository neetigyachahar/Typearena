//Importing modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

//Initailising utilities
app.set('port', 3000 || process.env.PORT );
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.get('/race', (req, res, next)=>{
    res.render('race');
});

app.all('/', (req, res, next)=>{
    res.render('home');
});

//Connected Database (future) and start listening
app.listen(app.get('port'), ()=>{
    console.log('Server is ready to rock!');
});