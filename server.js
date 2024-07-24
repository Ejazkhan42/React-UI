require("dotenv").config();
//Updates
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
const flash = require('express-flash');
var app = express();
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
  getscenario,
  getByCustomer,
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
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200
};

const jenkins = new Jenkins({
  baseUrl: `${process.env.Jenkins_Type}:/${process.env.Jenkins_Username}:${process.env.Jenkins_Password}@${process.env.Jenkins_Url}:${process.env.Jenkins_Port}`,
  crumbIssuer: true,
  formData: FormData
});
let browser=''
const initializePassport = require('./passport-config');
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

app.post('/login', passport.authenticate('local'), (req, res) => {
  res.send("success")
});
app.get('/job', async (req, res) => {
  try {

    const info = await jenkins.job.list()
    // console.log(info);

    // Send the info as a JSON response
    res.json(info);
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).send('Error retrieving Jenkins info');
  }
});
app.get('/jobInfo', async (req, res) => {
  try {

    const jobName = req.query.jobName;

    if (!jobName) {
      return res.status(400).send('Job name is required');
    }

    // Fetch job info from Jenkins
    const info = await jenkins.job.get(jobName);
    // console.log(info)
    // Send the info as a JSON response
    res.json(info);
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).send('Error retrieving Jenkins job info');
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

// Adjust the upload middleware to handle multiple fields
app.post('/build', upload.fields([
  { name: 'file', maxCount: 1 }, // Assuming 'file' is the main file
  { name: 'image', maxCount: 1 } // Assuming 'image' is the image file
]), async (req, res) => {
  try {
    const { jobName, testCase, gridMode, browsers, ProfilePath, Token } = req.body;
    const file = req.files['file'][0]; // Access the main file
    const image = req.files['image']? req.files['image'][0] : null;; // Access the image file

    if (!jobName) {
      return res.status(400).send('Job name is required');
    }

    if (!file) {
      return res.status(400).send('File is required');
    }

    if (!Token) {
      return res.status(400).send('Token is required');
    }

    // File paths on the server (local uploads directory)
    const localFilePath = file.path;
    const localImagePath =image? image.path : null;;

    // Prepare the parameters for the Jenkins job
    const parameters = {
      FILE: fs.createReadStream(localFilePath),
      TestCase: testCase || '',
      GridMode: gridMode || '',
      Browsers: browsers || '',
      ProfilePath: ProfilePath || '',
      Token: Token || '',
    };
    if (localImagePath) {
      parameters.Image = fs.createReadStream(localImagePath); // Add image parameter only if provided
    }
    const info = await jenkins.job.build({
      name: jobName,
      parameters: parameters
    });

    // Send the build info as a response
    res.json(info);
  } catch (error) {
    console.error('Error triggering Jenkins job:', error);
    res.status(500).send('Error triggering Jenkins job');
  } finally {
    // Clean up the uploaded files from local directory
    if (req.files) {
      Object.values(req.files).forEach(files => {
        files.forEach(file => {
          fs.unlinkSync(file.path); // Delete the uploaded files from uploads directory
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
  res.send(req.user)
});


app.get("/testcase", async (req, res) => {
  const orderId = req.query.id;
  const queryAllClientsWithOrdersCount = await getTestCasesByModule(orderId);
  Promise.resolve(queryAllClientsWithOrdersCount).then((results) => {
    res.send(results);
  })
})
app.get("/module", async (req, res) => {
  const user_id = req.query.user_id
  const queryAllClientsWithOrdersCount = await getByModule(user_id);
  Promise.resolve(queryAllClientsWithOrdersCount).then((results) => {
    res.send(results);
  })
})

//Get Customer
app.get("/customer", async (req, res) => {
  const user_id = req.query.user_id
  const queryAllClientsWithOrdersCount = await getByCustomer(user_id);
  Promise.resolve(queryAllClientsWithOrdersCount).then((results) => {
    res.send(results);
  })
})



// ADD NEW CLIENT SECTION *
app.post("/newclient", async (req, res) => {
  const clientDetails = req.body.clientDetails;
  const queryAddingNewClient = await addNewClient(clientDetails);
  Promise.resolve(queryAddingNewClient).then(() => {
    res.send("success");
  })
})


// API endpoint to get all Jenkins jobs and their details
app.post('/postlogs', async (req, res) => {
  const logs = req.body.logs;
  if (!Array.isArray(logs)) {
    return res.status(400).json({ error: 'Logs should be an array' });
  }

  try {
    const queryCreateNewLogs = await createNewLogs(logs);
    res.send("success");
  } catch (error) {
    console.error('Error creating logs:', error);
    res.status(500).json({ error: 'Failed to create logs' });
  }
});
app.get('/getlogs', async (req, res) => {
  try {
    const queryGetLogs = await Getlogs();
    Promise.resolve(queryGetLogs).then((results) => {
    res.send(results);
  })
  } catch (error) {
    console.error('Error Get logs:', error);
    res.status(500).json({ error: 'Failed to Get logs' });
  }
});
app.get("/getflow", async (req, res) => {
  const test_name = req.query.test_name
  console.log(test_name)
  const queryByTestCase = await getByTestCase(test_name);
  Promise.resolve(queryByTestCase).then((results) => {
    res.send(results);
  })
})

app.get("/getobject", async (req, res) => {
  const queryAllobjects = await getByobject();
  Promise.resolve(queryAllobjects).then((results) => {
    res.send(results);
  })
})



// DASHBOARD DATA SECTION *
app.get("/dashboard_data", async (req, res) => {
  const queryDashboardData = await getDasboardData();
  Promise.resolve(queryDashboardData).then((results) => {
    res.send(results);
  })
})
// END OF DASHBOARD DATA SECTION *



// GET USERS FOR ADMIN PANEL SECTION *
app.get("/getusers", async (req, res) => {
  const queryGetUsersForAdminPanel = await getUsersForAdminPanel();
  Promise.resolve(queryGetUsersForAdminPanel).then((results) => {
    res.send(results);
  })
})
// END OF GET USERS FOR ADMIN PANEL SECTION *

app.get("/getenv", async (req, res) => {
  const queryGetUsersForAdminPanel = await getenv();
  Promise.resolve(queryGetUsersForAdminPanel).then((results) => {
    res.send(results);
  })
})
app.get("/scenario", async (req, res) => {
  const queryGetscenario = await getscenario();
  Promise.resolve(queryGetscenario).then((results) => {
    res.send(results);
  })
})

// DELETE USER BY ID SECTION *
app.post("/deleteuser", async (req, res) => {
  let userId = req.body.userId;
  const queryDeleteUser = await deleteUserById(userId);
  Promise.resolve(queryDeleteUser).then(() => {
    res.send("success");
  })
});
// DELETE USER BY ID SECTION *
app.post("/deletenv", async (req, res) => {
  let envId = req.body.envId;
  const queryDeleteUser = await deleteEnvById(envId);
  Promise.resolve(queryDeleteUser).then(() => {
    res.send("success");
  })
});
// CREATE NEW USER SECTION *
app.post("/newuser", async (req, res) => {
  const userDetails = req.body.userDetails;
  console.log(userDetails)
  const hashedPassword = await bcrypt.hash(userDetails.password, 10);
  const queryCreateNewUser = await createNewUser(userDetails, hashedPassword);
  Promise.resolve(queryCreateNewUser).then(() => {
    res.send("success");
  })
})
// END OF CREATE NEW USER SECTION *
app.post("/newenv", async (req, res) => {
  const envDetails = req.body;
  const queryCreateNewUser = await createNewEnv(envDetails);
  Promise.resolve(queryCreateNewUser).then(() => {
    res.send("success");
  })
})
app.post("/postbrowser-id", async (req,res)=>{
  browser = req.body;
  console.log('Received browser ID:', browser);
  res.send('Browser ID received successfully');
})
app.get("/getbrowser-id",async(req,res)=>{
  res.send(browser)
})
app.post("/updateenv", async (req, res) => {
  const envDetails = req.body;
  const queryCreateNewUser = await updateEnv(envDetails);
  Promise.resolve(queryCreateNewUser).then(() => {
    res.send("success");
  })
})
app.get("/role", async(req,res)=>{
  const queryGetUsersForAdminPanel = await getroles();
  Promise.resolve(queryGetUsersForAdminPanel).then((results) => {
    res.send(results);
  })
})

const port = 5000;
app.listen(port, () => `Server running on port ${port}`);
