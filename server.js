require("dotenv").config();
//Updates
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
const flash = require('express-flash');
var app = express();
const FormData = require('form-data');
const fs = require('fs');
const multer=require('multer')
var bodyParser = require('body-parser');
var path = require('path');
var bcrypt = require('bcrypt');
const passport = require("passport");
const cors = require("cors");
const Jenkins=require("jenkins");
const {

  getAllDataFromTarget,
  getOrdersById,
  getClientById,
  getOrdersByClientId,
  getProductsBySingleOrderId,
  getProductsByMultipleOrderId,
  deleteProductsById,
  addMultipleProducts,
  updateOrderById,
  updateClientById,
  getAllClientsWithOrdersCount,
  addNewClient,
  getDasboardData,
  addNewEvent,
  addNewOrder,
  deleteUserById,
  getUsersForAdminPanel,
  createNewUser,
 getByModule,
  getTestCasesByModule,
} = require("./queries.js");

var connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  multipleStatements: true,
  timezone: 'utc'
});

// CONFIGURING OPTIONS
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200
};

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
    // Initialize the Jenkins client
    const jenkins = new Jenkins({
      baseUrl: 'https://Ejaz.Ahmed:D01ngERP!01@jenkins.doingerp.com:443',
      crumbIssuer: true // Set crumbIssuer to true if your Jenkins requires CSRF protection
    });

    // Fetch Jenkins info
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
    // Initialize the Jenkins client
    const jenkins = new Jenkins({
      baseUrl: 'https://Ejaz.Ahmed:D01ngERP!01@jenkins.doingerp.com:443',
      crumbIssuer: true // Set crumbIssuer to true if your Jenkins requires CSRF protection
    });

    // Extract the job name from query parameters
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


// Multer configuration for file upload to local directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// POST endpoint to handle file upload and trigger Jenkins build
app.post('/build', upload.single('file'), async (req, res) => {
  try {
    // Initialize Jenkins client
    const jenkins = new Jenkins({
      baseUrl: 'https://Ejaz.Ahmed:D01ngERP!01@jenkins.doingerp.com:443',
      crumbIssuer: true,
      formData:FormData
    });

    // Extract and validate the job name and other parameters
    const { jobName, testCase, gridMode, browsers ,ProfilePath,} = req.body;
    const file = req.file;
    const Image=req.Image;

    if (!jobName) {
      return res.status(400).send('Job name is required');
    }

    if (!file) {
      return res.status(400).send('File is required');
    }

    // File path on the server (local uploads directory)
    const localFilePath = file.path;

    // Prepare the parameters for the Jenkins job
    const parameters = {
      FILE: fs.createReadStream(localFilePath), // Read stream of the uploaded file
      TestCase: testCase || '',
      GridMode: gridMode || '',
      Browsers: browsers || '',
      ProfilePath: ProfilePath||'',
    };
    console.log(parameters.File)
    // Trigger the Jenkins job build
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
    // Clean up the uploaded file from local directory
    if (req.file) {
      fs.unlinkSync(req.file.path); // Delete the uploaded file from uploads directory
    }
  }
});

// app.post("/build",async(req,res)=>{
//   try {
//     // Initialize the Jenkins client
//     const jenkins = new Jenkins({
//       baseUrl: 'https://Ejaz.Ahmed:D01ngERP!01@jenkins.doingerp.com:443',
//       crumbIssuer: true // Set crumbIssuer to true if your Jenkins requires CSRF protection
//     });

//     // Extract the job name from query parameters
//     const build = req.body.build;

//     if (!jobName) {
//       return res.status(400).send('Job name is required');
//     }

//     // Fetch job info from Jenkins
//     const info = await jenkins.job.build({
//       name: build.JobName,
//       parameters: { File: fs.createReadStream(`${build.File}`),TestCase:`${build.TestCase}`,GridMode:`${build.GridMode}`,Browsers:`${build.Browsers}` },
//     });
//     // console.log(info)
//     // Send the info as a JSON response
//     res.json(info);
//   } catch (error) {
//     // Handle any errors that occur
//     console.error(error);
//     res.status(500).send('Error retrieving Jenkins job info');
//   }
// })


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
  const user_id=req.query.user_id
  const queryAllClientsWithOrdersCount = await getByModule(user_id);
  Promise.resolve(queryAllClientsWithOrdersCount).then((results) => {
    res.send(results);
  })
})
// END OF ALL CLIENTS SECTION *
app.get("/logs",async(req,res)=>{
  return "Log"
})

// ADD NEW CLIENT SECTION *
app.post("/newclient", async (req, res) => {
  const clientDetails = req.body.clientDetails;
  const queryAddingNewClient = await addNewClient(clientDetails);
  Promise.resolve(queryAddingNewClient).then(() => {
    res.send("success");
  })
})
// END OF ADDING NEW CLIENT SECTION *

// CLIENT BY ID SECTION *
app.get("/client_by_id", async (req, res) => {
  const clientId = req.query.id;

  const queryClientById = await getClientById(clientId);
  const queryOrdersByClientId = await getOrdersByClientId(clientId);
  const queryProductsByOrderId = await getProductsByMultipleOrderId(queryOrdersByClientId);

  Promise.all([queryClientById, queryOrdersByClientId, queryProductsByOrderId]).then((results) => {
    res.send(results);
  });
});
// END OF CLIENT BY ID SECTION *

// DASHBOARD DATA SECTION *
app.get("/dashboard_data", async (req,res) => {
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

// DELETE USER BY ID SECTION *
app.post("/deleteuser", async (req, res) => {
  let userId = req.body.userId;
  const queryDeleteUser = await deleteUserById(userId);
  Promise.resolve(queryDeleteUser).then(() => {
    res.send("success");
  })
});
// DELETE USER BY ID SECTION *

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

const port = 5000;
app.listen(port, () => `Server running on port ${port}`);
