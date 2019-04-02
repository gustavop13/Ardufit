#!/usr/bin/env node
var serialserver = require('./p5.serialserver.js');
//serialserver.start();
//console.log("p5.serialserver is running");

const app = require('express')();
const session = require('client-sessions');
const bodyParser = require('body-parser');
const express = require('express');
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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');


app.use(session({
  secret: '0GBlJZ9EKBt2Zbi2flRPvztczCewBxXK',
  duration: 1 * 60 * 60 * 1000,
  activeDuration: 1 * 20 * 60 * 1000,
  cookie: {
    ephemeral: true,
    points: 0,
  }
}));

app.get('/', function (req, res) {
  var query = "SELECT user_name, points FROM users ORDER BY points DESC LIMIT 20";
  con.query(query, function (err, result) {
    if(err) throw err;
    if (req.session_state.username) {
      res.render('index', {name: req.session_state.username, leaderboard: result});
    } else {
      res.render('index', {name: null, leaderboard: result})
    }
  });
});

app.get('/about', function(req, res) {
  res.render('about', {name: req.session_state.username});
});

app.get('/sketch', function(req, res) {
  res.render('sketch', {name: req.session_state.username});
});

app.get('/signup', function(req, res) {
  res.render('signup');
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.get('/dashboard', function(req, res) {
  var total = 0;
  var query = "SELECT points FROM users WHERE user_name='" + req.session_state.username + "';";
  con.query(query, function (err, result) {
    total = result[0].points;
  });
  query = "SELECT SUM(points) AS points, date FROM entries WHERE user_name='" + req.session_state.username + "' GROUP BY date ORDER BY date LIMIT 7;";
  con.query(query, function (err, result) {
    if(err) throw err;
    res.render('dashboard', {name: req.session_state.username, points: total, entries: result});
  });
});

app.post('/signup', function(req, res) {
  var query = "SELECT 1 FROM users WHERE user_name = '" + req.body.username + "';";
  con.query(query, function (err, result) {
    if (err) throw err;
    if(!result[0]) {
      query = "INSERT INTO users(user_name, password, points) VALUES ('" + req.body.username + "', '" + req.body.password + "', 0);";
      con.query(query, function (err, result) {
      });
      query = "SELECT user_name, points FROM users WHERE user_name = '" + req.body.username + "';";
      con.query(query, function (err, result) {
        req.session_state.username = result[0].user_name;
        res.redirect('/dashboard');
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
      req.session_state.username = result[0].user_name;
      res.redirect('/dashboard');
    } else {
      res.send("Incorrect Username or Password")
    }
  });
});

app.post('/sketch', function(req, res) {
  var query = "UPDATE users SET points = points + " + req.body.points + " WHERE user_name = '" + req.session_state.username + "';";
  con.query(query, function (err, result) {
  });
  var d = new Date().toISOString().slice(0, 10).replace('T', ' ');
  query = "INSERT INTO entries VALUES ('" + req.session_state.username + "', " + req.body.points + ", '" + d + "');";
  con.query(query, function (err, result) {
    res.redirect('/dashboard');
  });
});

app.get('/logout', function(req, res) {
  req.session_state.reset();
  res.redirect('/');
});

app.listen(3000);
