#!/usr/bin/env node
var serialserver = require('./p5.serialserver.js');
//serialserver.start();
//console.log("p5.serialserver is running");

var express = require('express');
var app = express();
const bodyParser = require('body-parser');

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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index')
})

app.post('/', function (req, res) {
  res.render('index');
  console.log(req.body.message);
})

app.listen(3000)
