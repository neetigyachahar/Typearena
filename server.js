//Importing modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
// const guestModel = require('./models/guestUser');
const randomString = require('randomstring');
const socketService = require('./utilities/socketService');
const session = require('express-session');
const socketSession = require('express-socket.io-session');
const SessionInMongoDB = require('connect-mongodb-session')(session);
const MONGODB_URI = "mongodb+srv://neetigya:pvx8RHA8CQb8O07l@cluster0-gdzqa.mongodb.net/typearena?retryWrites=true&w=majority"
const store = new SessionInMongoDB({
  uri: MONGODB_URI,
  collection: 'session'
});

//Routes
const adminRoutes = require('./routes/admin');
const user = require('./routes/user');

const raceCon = require('./controllers/race.js');
const loginVerify = require('./middleware/loginVerify');

//Initailising utilities
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

//storing sessions
const sessionConfig = {secret: 'my secret', resave: false, saveUninitialized: false, store: store};
app.use(session(sessionConfig));

app.use((req, res, next)=>{
  req.session['user'] = {
    _id: randomString.generate(10),
    name: 'Guest',
    isLoggedIn: false
  }
  next();
});

app.use('/admin', adminRoutes);

app.use('/', user);

app.get('/race', raceCon.race);

app.get('/errorAnimation', (req, res, next)=>{
  res.render('errorAnimation');
});

app.all('*', loginVerify('<div style="font-size: 100px;"> 404 </div><br>Resource not found.'), (req, res, next)=>{
  res.render('error', {
    logged: req.session.isLoggedIn,
    name: req.session.user.name,
    msg: "Resource not found. <br>Error: 404"
  });
});

//Connected Database and start listening
mongoose
  .connect(MONGODB_URI, {useUnifiedTopology: true,  useCreateIndex: true, useNewUrlParser: true})
  .then(result => {
    const server = app.listen(process.env.PORT || 5000,()=>{
      console.log('Server is ready to rock!');

      //start Socket listening
      socketService.init(server, ()=>{

        //start raceOrganiser
        require('./backendService/raceOrganiser')();

        //sharing sessions to socket.io
        socketService.IO().of('/race').use(socketSession(session(sessionConfig), {
          secret: 'my secret',
          resave: false, 
          saveUninitialized: false
        }));

      });

    });

  })
  .catch(err => {
    console.log(err);
  });