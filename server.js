
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');
//const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');
//const uri = "mongodb+srv://derogerbaggio19:speak123@sccmp.4yjjg8j.mongodb.net/sccmpdb?retryWrites=true&w=majority";
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
//const port = 3000;
const passport = require('passport');
const { loginCheck } = require('./auth/passport');
loginCheck(passport);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const database = process.env.MONGOLAB_URI;
mongoose.connect(database, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.log(err));
//BodyParsing
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(session({
  secret:'oneboy',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.flash = req.flash();
  next();
});

app.use(passport.initialize());
app.use(passport.session());
//Routes
app.use('/', require('./routes/login'));
app.use('/', require('./routes/complaint'));

//app.use('/complaints', require('./routes/complaint'));
app.use('/dashboard', require('./routes/dashboard'));
// Inside your server.js or app.js file

app.use('/send-email', require('./routes/dashboard'));
app.use('/update-user', require('./routes/dashboard'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
app.get('/', (req, res) => {
  res.render('home');
});


app.use(express.static(path.join(__dirname)));
