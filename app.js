require("dotenv").config();
//Updates
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
const flash = require('express-flash');
const app = express();
const FormData = require('form-data');
const fs = require('fs');
const multer = require('multer')
var bodyParser = require('body-parser');
var path = require('path');
var bcrypt = require('bcrypt');
const passport = require("passport");
const cors = require("cors");
const Jenkins = require("jenkins");
const {
  createNewEnv,
  getAllDataFromTarget,
  getDasboardData,
  deleteUserById,
  getUsersForAdminPanel,
  createNewUser,
  getByModule,
  getTestCasesByModule,
  deleteEnvById,
  getenv,
  getByTestCase,
  getByobject,
  createNewLogs,
  updateEnv,
  Getlogs,
  getroles,
  newReports,
  getscenario,
  getByTestCases,
  getByCustomer
} = require("./queries.js");


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
  origin: "http://103.91.186.135:3000",
  credentials: true,
  optionSuccessStatus: 200
};

const jenkins = new Jenkins({
  baseUrl: `${process.env.Jenkins_Type}:/${process.env.Jenkins_Username}:${process.env.Jenkins_Password}@${process.env.Jenkins_Url}:${process.env.Jenkins_Port}`,
  crumbIssuer: true,
  formData: FormData
});

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
app.use(express.static(path.join(__dirname, 'client/public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/public', 'index.html'));
});

const port = 5000;
app.listen(port, () => `Server running on port ${port}`);