var express = require('express');

var multer = require('multer');

var app = express();

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

var teacherRouter = require('./routes/teacher');

var app = express();

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/teacher', teacherRouter);

app.get('/test', function (req, res) {
    res.render('teacher/upload');
});

app.listen(8000,function(){
    console.log('Server is running on port 8000');
});