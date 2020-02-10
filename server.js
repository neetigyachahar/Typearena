//Importing modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

//Initailising utilities
app.set('views', 'views');
app.use(bodyParser.urlencoded({extended: true}));

app.all('/', (req, res, next)=>{
    res.send('Welcome to the home page!!');
});

//Connected Database (future) and start listening
app.listen(3000, ()=>{
    console.log('Server is ready to rock!');
});