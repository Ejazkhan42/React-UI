const express = require('express');
require("dotenv").config();
const mysql = require('mysql');
const app = express.Router();
const FormData = require('form-data');
const fs = require('fs');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require("passport");
const Jenkins = require("jenkins");
const {
  getMenuLevel,
  deleteCustomer,
  updateCustomer,
  createNewCustomer,
  getDashboardData,
  deleteUserById,
  getUsersForAdminPanel,
  createNewUser,
  getByModule,
  getTestCasesByModule,
  getByTestCase,
  getByObject,
  createNewLogs,
  getLogs,
  getRoles,
  newReports,
  getScenario,
  getByTestCases,
  getByCustomer
} = require("./queries.js");

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  multipleStatements: true,
  port: process.env.DB_PORT,
  timezone: 'utc',
});

let browser = '';

const jenkins = new Jenkins({
  baseUrl: `${process.env.JENKINS_TYPE}://${process.env.JENKINS_USERNAME}:${process.env.JENKINS_PASSWORD}@${process.env.JENKINS_URL}:${process.env.JENKINS_PORT}`,
  crumbIssuer: true,
  formData: FormData
});

const initializePassport = require('./passport-config.js');
initializePassport(connection, passport);

app.post('/login', passport.authenticate('local'), (req, res) => {
  res.send("success");
});

app.get("/getByCustomer", async (req, res) => {
  try {
    const userId = req.query.user_id;
    const customers = await getByCustomer(userId);
    res.send(customers);
  } catch (error) {
    console.error('Error fetching customers by ID:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.put("/updateCustomer", async (req, res) => {
  try {
    const customerDetails = req.body;
    await updateCustomer(customerDetails);
    res.send("Updates");
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete("/deleteCustomer", async (req, res) => {
  try {
    const customerId = req.query.deletecustomer;
    await deleteCustomer(customerId);
    res.send("delete");
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post("/addCustomer", async (req, res) => {
  try {
    const customerDetails = req.body;
    const result = await createNewCustomer(customerDetails);
    res.send(result);
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).send('Internal Server Error');
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/build', upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), async (req, res) => {
  try {
    const { JobName, TestCase, GridMode, Browsers, ProfilePath, Token } = req.body;
    const file = req.files['file'] ? req.files['file'][0] : null;
    const image = req.files['image'] ? req.files['image'][0] : null;
    if (!JobName) {
      return res.status(400).send('Job name is required');
    }

    if (!Token) {
      return res.status(400).send('Token is required');
    }

    const localFilePath = file ? file.path : null;
    const localImagePath = image ? image.path : null;

    const parameters = {
      TestCase: TestCase || '',
      GridMode: GridMode || '',
      Browsers: Browsers || '',
      ProfilePath: ProfilePath || '',
      Token: Token || '',
    };
    if (localFilePath) {
      parameters.FILE = fs.createReadStream(localFilePath);
    }
    if (localImagePath) {
      parameters.Image = fs.createReadStream(localImagePath);
    }

    if (JobName) {
      const info = await jenkins.job.build({
        name: JobName,
        parameters: parameters
      });
      res.json(info);
    } else {
      res.status(500).send('Error triggering Jenkins job');
    }
  } catch (error) {
    console.error('Error triggering Jenkins job:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    if (req.files) {
      Object.values(req.files).forEach(files => {
        files.forEach(file => {
          fs.unlinkSync(file.path);
        });
      });
    }
  }
});

app.get('/logout', (req, res) => {
  req.logout();
  res.send("success");
});

app.get('/user', (req, res) => {
  res.send(req.user);
});

app.get("/testCase", async (req, res) => {
  try {
    const moduleId = req.query.id;
    const testCases = await getTestCasesByModule(moduleId);
    res.send(testCases);
  } catch (error) {
    console.error('Error fetching test cases by module:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/module", async (req, res) => {
  try {
    const userId = req.query.user_id;
    const modules = await getByModule(userId);
    res.send(modules);
  } catch (error) {
    console.error('Error fetching modules by user ID:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/postLogs', async (req, res) => {
  try {
    const logs = req.body.logs;
    if (!Array.isArray(logs)) {
      return res.status(400).json({ error: 'Logs should be an array' });
    }
    await createNewLogs(logs);
    res.send("success");
  } catch (error) {
    console.error('Error creating logs:', error);
    res.status(500).json({ error: 'Failed to create logs' });
  }
});

app.get('/getLogs', async (req, res) => {
  try {
    const logs = await getLogs();
    res.send(logs);
  } catch (error) {
    console.error('Error getting logs:', error);
    res.status(500).json({ error: 'Failed to get logs' });
  }
});

app.get("/getFlow", async (req, res) => {
  try {
    const testName = req.query.test_name;
    if (!testName) {
      const testCases = await getByTestCases();
      res.send(testCases);
    } else {
      const testCase = await getByTestCase(testName);
      res.send(testCase);
    }
  } catch (error) {
    console.error('Error getting flow data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/getObject", async (req, res) => {
  try {
    const objects = await getByObject();
    res.send(objects);
  } catch (error) {
    console.error('Error getting objects:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/dashboardData", async (req, res) => {
  try {
    const dashboardData = await getDashboardData();
    res.send(dashboardData);
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/getUsers", async (req, res) => {
  try {
    const users = await getUsersForAdminPanel();
    res.send(users);
  } catch (error) {
    console.error('Error getting users for admin panel:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/scenario", async (req, res) => {
  try {
    const scenarios = await getScenario();
    res.send(scenarios);
  } catch (error) {
    console.error('Error getting scenarios:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post("/deleteUser", async (req, res) => {
  try {
    const userId = req.body.userId;
    await deleteUserById(userId);
    res.send("success");
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post("/newUser", async (req, res) => {
  try {
    const userDetails = req.body.userDetails;
    console.log(userDetails);
    const hashedPassword = await bcrypt.hash(userDetails.password, 10);
    await createNewUser(userDetails, hashedPassword);
    res.send("success");
  } catch (error) {
    console.error('Error creating new user:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post("/reportsLogs", async (req, res) => {
  try {
    const reports = req.body;
    await newReports(reports);
    res.send("success");
  } catch (error) {
    console.error('Error creating reports:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post("/postBrowserId", (req, res) => {
  try {
    browser = req.body;
    res.send('Received successfully');
  } catch (error) {
    console.error('Error posting browser ID:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/getBrowserId", (req, res) => {
  try {
    res.send(browser);
  } catch (error) {
    console.error('Error getting browser ID:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post("/updateEnv", async (req, res) => {
  try {
    const envDetails = req.body.envDetails;
    await updateEnv(envDetails);
    res.send("success");
  } catch (error) {
    console.error('Error updating environment:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/menuLevel", async (req, res) => {
  try {
    const role = req.query.role;
    const queryGetMenuLevel = await getMenuLevel(role);
    res.send(queryGetMenuLevel);
  } catch (error) {
    console.error('Error getting menu level:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/role", async (req, res) => {
  try {
    const queryGetRoles = await getRoles();
    res.send(queryGetRoles);
  } catch (error) {
    console.error('Error getting roles:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = app;
