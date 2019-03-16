#!/usr/bin/env node
var serialserver = require('./p5.serialserver.js');
//serialserver.start();
//console.log("p5.serialserver is running");

var express = require('express');
var session = require('client-sessions');
const bodyParser = require('body-parser');
var app = express();

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "ardufit",
  password: "password",
  database: "ardufit"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.use(session({
  cookieName: 'session',
  secret: '0GBlJZ9EKBt2Zbi2flRPvztczCewBxXK',
  username: '',
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.post('/', function(req, res) {
  req.session.username = req.body.message;
  var name = req.session.username;
  if(name != 'something') {
    res.render('index', {name: req.session.username});
  } else {
    res.render('index');
  }
});

app.get('/', function (req, res) {
  var name = req.session.username;
  if(name != '') {
    res.render('index', {name: req.session.username});
  } else {
    res.render('index');
  }
});

app.get('/about', function(req, res) {
  res.render('about');
});

app.get('/sketch', function(req, res) {
  res.render('sketch');
});

app.get('/logout', function(req, res) {
  req.session.reset();
});

app.listen(3000)
