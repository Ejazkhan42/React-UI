require("dotenv").config();

var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
const flash = require('express-flash');
const app = express();
const FormData = require('form-data');
var bodyParser = require('body-parser');
var path = require('path');
const passport = require("passport");
const cors = require("cors");
const Jenkins = require("jenkins");


var connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  multipleStatements: true,
  port: process.env.DB_PORT,
  timezone: 'utc',
});

// CONFIGURING OPTIONS
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200
};


const initializePassport = require('./passport-config.js');
initializePassport(connection, passport);

app.use(cors(corsOptions));
app.use(flash());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
// END OF CONFIGURING OPTIONS
app.use('/api',require("./router.js"))
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = 5000;
app.listen(port, () => `Server running on port ${port}`);