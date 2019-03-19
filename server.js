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
  if(err) {
    console.log(err.code);
    console.log(err.fatal);
  }
});

app.use(session({
  cookieName: 'session',
  secret: '0GBlJZ9EKBt2Zbi2flRPvztczCewBxXK',
  username: '',
  duration: 1 * 60 * 60 * 1000,
  activeDuration: 1 * 20 * 60 * 1000,
  cookie: {
    ephemeral: true,
  }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index', {name: null});
});

app.post('/dashboard', function (req, res) {
  req.session.username = req.body.message;
  var query = "SELECT points FROM users WHERE user_name='" + req.session.username + "';";
  con.query(query, function(err, results, fields) {
    res.render('dashboard', {name: req.session.username, points: "" + results[0].points});
  });
});

app.get('/about', function(req, res) {
  res.render('about');
});

app.get('/sketch', function(req, res) {
  res.render('sketch');
});

app.get('/signup', function(req, res) {
  res.render('signup');
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.get('/logout', function(req, res) {
  req.session.reset();
  res.render('index', {name: req.session.username});
});

app.listen(3000);
