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
  getBytest_case,
  getByflow,
  createNewLogs,
  updateEnv
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
    // // Initialize Jenkins client
    // const jenkins = new Jenkins({
    //   baseUrl: 'https://Ejaz.Ahmed:D01ngERP!01@jenkins.doingerp.com:443',
    //   crumbIssuer: true,
    //   formData:FormData
    // });

    // Extract and validate the job name and other parameters
    const { jobName, testCase, gridMode, browsers, ProfilePath, } = req.body;
    const file = req.file;
    const Image = req.Image;

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
      ProfilePath: ProfilePath || '',
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

// ADD NEW CLIENT SECTION *
app.post("/newclient", async (req, res) => {
  const clientDetails = req.body.clientDetails;
  const queryAddingNewClient = await addNewClient(clientDetails);
  Promise.resolve(queryAddingNewClient).then(() => {
    res.send("success");
  })
})

// Helper function to fetch job details with parallel requests
const fetchJobDetails = async (job, path) => {
  try {
    const jobDetails = await jenkins.job.get(`${path}${job.name}`);
    const buildDetails = await fetchBuildDetails(jobDetails);

    return {
      name: job.name,
      url: job.url,
      color: job.color,
      totalBuilds: buildDetails.total,
      passedBuilds: buildDetails.passed,
      failedBuilds: buildDetails.failed,
      recentBuild: buildDetails.recentBuild
    };
  } catch (error) {
    console.error(`Error fetching details for job: ${job.name}`, error);
    return null; // Return null to indicate a failure fetching this job's details
  }
};

// Helper function to fetch build details for a job
const fetchBuildDetails = async (jobDetails) => {
  let total = 0;
  let passed = 0;
  let failed = 0;
  let running = false;
  let recentBuild = null;

  // Fetch only the latest 10 builds to reduce the number of API calls
  const recentBuilds = jobDetails.builds.slice(0, 10);

  const buildPromises = recentBuilds.map(async (build) => {
    try {
      const buildInfo = await jenkins.build.get(jobDetails.fullName, build.number);
      total++;
      if (buildInfo.result === 'SUCCESS') {
        passed++;
      } else if (buildInfo.result === 'FAILURE') {
        failed++;
      } else if (buildInfo.building) {
        running = true;
      }

      if (!recentBuild || buildInfo.timestamp > recentBuild.timestamp) {
        recentBuild = {
          name: jobDetails.name,
          number: buildInfo.number,
          result: buildInfo.result,
          timestamp: buildInfo.timestamp,
          duration: buildInfo.duration,
          url: buildInfo.url
        };
      }
    } catch (error) {
      console.warn(`Build ${build.number} for job ${jobDetails.name} not found or error occurred`, error);
    }
  });

  await Promise.all(buildPromises);

  return { total, passed, failed, running, recentBuild };
};

// Helper function to recursively fetch all jobs and their details with parallelization

const fetchAllJobs = async (path = '') => {
  const jobs = await jenkins.job.list(path);
  let allJobs = [];
  let totalBuilds = 0;
  let passedBuilds = 0;
  let failedBuilds = 0;
  let runningJobs = [];
  let recentJobs = [];

  const jobPromises = jobs.map(async (job) => {
    if (job._class === 'com.cloudbees.hudson.plugins.folder.Folder') {
      const folderData = await fetchAllJobs(`${path}${job.name}/`);
      allJobs = [...allJobs, ...folderData.jobs];
      totalBuilds += folderData.totalBuilds;
      passedBuilds += folderData.passedBuilds;
      failedBuilds += folderData.failedBuilds;
      runningJobs = [...runningJobs, ...folderData.runningJobs];
      recentJobs = [...recentJobs, ...folderData.recentJobs];
    } else {
      const jobDetail = await fetchJobDetails(job, path);
      if (jobDetail) {
        allJobs.push(jobDetail);
        totalBuilds += jobDetail.totalBuilds;
        passedBuilds += jobDetail.passedBuilds;
        failedBuilds += jobDetail.failedBuilds;
        if (jobDetail.running) {
          runningJobs.push({
            name: job.name,
            url: job.url,
            status: 'running'
          });
        }
        if (jobDetail.recentBuild) {
          recentJobs.push(jobDetail.recentBuild);
        }
      }
    }
  });

  await Promise.all(jobPromises);

  return { jobs: allJobs, totalBuilds, passedBuilds, failedBuilds, runningJobs, recentJobs };
};

// API endpoint to get all Jenkins jobs and their details
app.post('/logs', async (req, res) => {
  const logs = req.body.logs;
  console.log(logs)
  if (!Array.isArray(logs)) {
    return res.status(400).json({ error: 'Logs should be an array' });
  }

  try {
    const queryCreateNewUser = await createNewLogs(logs);
    res.send("success");
  } catch (error) {
    console.error('Error creating logs:', error);
    res.status(500).json({ error: 'Failed to create logs' });
  }
});
app.post('/getlogs', async (req, res) => {
  const logs = req.body.logs;
  try {
    const queryCreateNewUser = await createNewLogs(logs);
    res.send("success");
  } catch (error) {
    console.error('Error creating logs:', error);
    res.status(500).json({ error: 'Failed to create logs' });
  }
});
app.get("/getflow", async (req, res) => {
  const test_case = req.query.test_case
  console.log(test_case)
  const queryAlltest_case = await getBytest_case(test_case);
  Promise.resolve(queryAlltest_case).then((results) => {
    res.send(results);
  })
})

app.get("/getcomp", async (req, res) => {
  const flow = req.query.flow
  const queryAlltest_case = await getByflow(flow);
  Promise.resolve(queryAlltest_case).then((results) => {
    res.send(results);
  })
})

// try {
  //   const data = await fetchAllJobs();
  //   const response = {
  //     totalJobs: data.jobs.length,
  //     totalBuilds: data.totalBuilds,
  //     passedBuilds: data.passedBuilds,
  //     failedBuilds: data.failedBuilds,
  //     jobs: data.jobs,
  //     runningJobs: data.runningJobs,
  //     recentJobs: data.recentJobs
  //   };
  //   res.json(response);
  // } catch (error) {
  //   console.error('Error fetching jobs:', error);
  //   res.status(500).json({ error: 'Failed to fetch jobs' });
  // }


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
  const envDetails = req.body.envDetails;
  const queryCreateNewUser = await createNewEnv(envDetails);
  Promise.resolve(queryCreateNewUser).then(() => {
    res.send("success");
  })
})
app.post("/updateenv", async (req, res) => {
  const envDetails = req.body.envDetails;
  const queryCreateNewUser = await updateEnv(envDetails);
  Promise.resolve(queryCreateNewUser).then(() => {
    res.send("success");
  })
})

const port = 5000;
app.listen(port, () => `Server running on port ${port}`);
