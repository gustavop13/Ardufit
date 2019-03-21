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
  username: null,
  duration: 1 * 60 * 60 * 1000,
  activeDuration: 1 * 20 * 60 * 1000,
  cookie: {
    ephemeral: true,
    points: 0,
  }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index', {name: session.username});
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

app.get('/dashboard', function(req, res) {
  var query = "SELECT points FROM users WHERE user_name='" + session.username + "';";
  con.query(query, function (err, result) {
    if(err) throw err;
    res.render('dashboard', {name: session.username, points: "" + result[0].points});
  });
});

app.post('/signup', function(req, res) {
  var query = "SELECT 1 FROM users WHERE user_name = '" + req.body.username + "';";
  //res.send(query);
  con.query(query, function (err, result) {
    if (err) throw err;
    if(!result[0]) {
      query = "INSERT INTO users(user_name, password, points) VALUES ('" + req.body.username + "', '" + req.body.password + "', 0);";
      con.query(query, function (err, result) {
      });
      query = "SELECT user_name, points FROM users WHERE user_name = '" + req.body.username + "';";
      con.query(query, function (err, result) {
        session.username = result[0].user_name;
        res.render('dashboard', {name: session.username, points: "" + result[0].points});
      });
    } else {
      res.send("Username taken.");
    }
  });
});

app.post('/login', function(req, res) {
  var query = "SELECT user_name, password, points FROM users WHERE user_name = '" + req.body.username + "' AND password = '" + req.body.password + "';";
  con.query(query, function (err, result) {
    if (err) throw err;
    if(result[0]) {
      session.username = result[0].user_name;
      res.render('dashboard', {name: session.username, points: "" + result[0].points});
    } else {
      res.send("Incorrect Username or Password")
    }
  });
});

app.get('/logout', function(req, res) {
  req.session.reset();
  res.render('index', {name: null});
});

app.listen(3000);
