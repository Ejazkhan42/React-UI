const { query } = require('express');
const fs=require("fs")
var mysql = require('mysql');


var connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  port:process.env.DB_PORT,
  multipleStatements: true,
  timezone: 'utc',
});


function getAllDataFromTarget(target) {
  const queryString = `SELECT * from ${target}`;
  return new Promise((resolve, reject) => {
    connection.query(queryString, function(error, result) {
      if(error) {
        console.log(error);
      } else {
        resolve(result);
      }
    })
  })
}



function getTestCasesByModule(moduleName) {
  // SQL query to get test cases based on the module name
  const queryString = `
    SELECT * FROM Script_View where Modules_id=?;
  `;

  // Return a promise that resolves with the result of the query
  return new Promise((resolve, reject) => {
    connection.query(queryString, [moduleName], function(error, result) {
      if (error) {
        console.error("Error executing query:", error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

function getByModule(user_id) {
  // SQL query to get test cases based on the module name
  const queryString = `SELECT * FROM Modules_View Where User_id=?`;

  // Return a promise that resolves with the result of the query
  return new Promise((resolve, reject) => {
    connection.query(queryString,[user_id], function(error, result) {
      if (error) {
        console.error("Error executing query:", error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

function getByCustomer(user_id) {
  // SQL query to get test cases based on the module name
  const queryString = "SELECT * FROM customer_view WHERE id=?;";
  
  
  // Return a promise that resolves with the result of the query
  return new Promise((resolve, reject) => {
      connection.query(queryString, [user_id], function (error, result) {
          if (error) {
              console.error("Error executing query:", error);
              reject(error);
          } else {
              const formattedResult = result.reduce((acc, curr) => {
                  const { name, id, ...rest } = curr;
                  if (!acc[name]) {
                      acc[name] = [];
                  }
                  acc[name].push(rest);
                  return acc;
              }, {});
              resolve(formattedResult);
          }
      });
  });
  }


function getDasboardData() {
  const queryString = `
  SELECT * from clients as clients;
  SELECT * from orders as orders;
  SELECT * from calendar where deadlineDate >= curdate() and DATEDIFF(deadlineDate, CURDATE()) <= 5 order by deadlineDate asc limit 2
  `;
  return new Promise((resolve, reject) => {
    connection.query(queryString, function(error, result) {
      if(error) {
        console.log(error);
      } else {
        resolve(result);
      }
    })
  })
}



function deleteUserById(userId) {
  const queryString = "DELETE from users WHERE id = ?";
  return new Promise((resolve, reject) => {
    connection.query(queryString, [userId], function(error) {
      if(error) {
        console.log(error);
      } else {
        resolve("success")
      }
    })
  })
}

function deleteEnvById(envId) {
  const queryString = "DELETE from env WHERE id = ?";
  return new Promise((resolve, reject) => {
    connection.query(queryString, [envId], function(error) {
      if(error) {
        console.log(error);
      } else {
        resolve("success")
      }
    })
  })
}



function getUsersForAdminPanel() {
  const queryString = "SELECT id, username, role_id, created_at from users";
  return new Promise((resolve, reject) => {
    connection.query(queryString, function(error, result) {
      if(error) {
        console.log(error);
      } else {
        resolve(result);
      }
    })
  })
}


function getenv() {
  const queryString = "SELECT id,envName , user_Id, instance_url, instance_username, instance_password from env";
  return new Promise((resolve, reject) => {
    connection.query(queryString, function(error, result) {
      if(error) {
        console.log(error);
      } else {
        resolve(result);
      }
    })
  })
}

function createNewUser(userDetails, hashedPassword) {
  const queryString = "INSERT into Users VALUES ('', ?, ?, ?, ?)";
  const currentDate = new Date();
  const passedValues = [userDetails.username, hashedPassword, userDetails.role_id, currentDate];
  return new Promise((resolve, reject) => {
    connection.query(queryString, passedValues, function(error) {
      if(error) {
        console.log(error);
      } else {
        resolve("success");
      }
    })
  })
}
function createNewEnv(envDetails) {
  // SQL query for upsert (Insert or Update)
  const queryString = `
  INSERT INTO env (envName, user_id, instance_url, instance_username, instance_password) 
  VALUES (?,?,?,?,?)
`;

// Array of values to be inserted or updated
const passedValues = [
  envDetails.envName,
  envDetails.user_id,
  envDetails.instance_url,
  envDetails.instance_username,
  envDetails.instance_password
];
  

  // Return a promise for the database operation
  return new Promise((resolve, reject) => {
    connection.query(queryString, passedValues, function (error) {
      if (error) {
        console.log(error);
        reject(error); // Reject the promise with the error
      } else {
        resolve("success"); // Resolve the promise with success message
      }
    });
  });
}

function createNewLogs(logs) {
  // SQL query for batch insertion
  const queryString = `
    INSERT INTO logs (test_name, start_time, end_time, test_status, build, job) VALUES ?
  `;

  // Extracting values from each log entry
  const values = logs.map(log => [
    log.test_name,
    formatDateTime(log.start_time),
    formatDateTime(log.end_time),
    log.test_status,
    log.build,
    log.job
  ]);

  // Return a promise for the database operation
  return new Promise((resolve, reject) => {
    connection.query(queryString, [values], function (error) {
      if (error) {
        console.log(error);
        reject(error); // Reject the promise with the error
      } else {
        resolve("success"); // Resolve the promise with success message
      }
    });
  });
}

function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  const formattedDateTime = date.toISOString().slice(0, 19).replace('T', ' ');
  return formattedDateTime;
}

function updateEnv(envDetails) {
  const queryString = `
  UPDATE env 
  SET envName = ?, 
      user_Id = ?, 
      instance_url = ?, 
      instance_username = ?, 
      instance_password = ? 
  WHERE id = ?;
`;

// Array of values to be updated
console.log('envDetails:', envDetails);

const passedValues = [
  envDetails.envName,          // Test
  envDetails.user_Id,          // 1 (Ensure column name is user_id)
  envDetails.instance_url,     // https://hdbg-test.login.us2.oraclecloud.com/
  envDetails.instance_username,// herbert.george@nexinfo.com
  envDetails.instance_password,// Nexinfo@12312qqw
  envDetails.id                // 1
];


  // Return a promise for the database operation
  console.log('Values being used:', passedValues);
  return new Promise((resolve, reject) => {
    connection.query(queryString, passedValues, function (error, results) {
      if (error) {
        console.log(error);
        reject(error); // Reject the promise with the error
      } else {
        console.log(results)
        resolve(results.affectedRows); // Resolve with the number of affected rows
      }
    });
  });
}

function getByTestCase(test_name) {
  const queryString = "SELECT DISTINCT Test_Case, component_name, Description, cammand as Command, Target, Value FROM flow_view WHERE Test_Case=?";

  return new Promise((resolve, reject) => {
    connection.query(queryString, [test_name], function (error, results) {
      if (error) {
        reject(error);
      } else {
        const formattedData = {};

        results.forEach(row => {
          const { component_name, Description, Command, Target, Value } = row;

          // Initialize test case object if it doesn't exist
          if (!formattedData[test_name]) {
            formattedData[test_name] = {};
          }


          if (!formattedData[test_name][component_name]) {
            formattedData[test_name][component_name] = [];
          }

          // Add the row data to the component array
          formattedData[test_name][component_name].push({
            Target,
            Command,
            Value,
            Description
          });
        });

        resolve(formattedData);
      }
    });
  });
}

function getByTestCases() {
  const queryString = `SELECT DISTINCT Test_Case, component_name, Description, cammand as Command, Target, Value FROM flow_view`;

  return new Promise((resolve, reject) => {
    connection.query(queryString, function (error, results) {
      if (error) {
        reject(error);
      } else {
        const formattedData = {};

        results.forEach(row => {
          const { Test_Case, component_name, Description, Command, Target, Value } = row;

          // Initialize test case object if it doesn't exist
          if (!formattedData[Test_Case]) {
            formattedData[Test_Case] = {};
          }

          if (!formattedData[Test_Case][component_name]) {
            formattedData[Test_Case][component_name] = [];
          }

          // Add the row data to the component array
          formattedData[Test_Case][component_name].push({
            Target,
            Command,
            Value,
            Description
          });
        });

        resolve(formattedData);
      }
    });
  });
}



function getByobject() {
  const queryString = "SELECT * FROM objects_view";
  return new Promise((resolve, reject) => {
    connection.query(queryString, function(error, results) {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

function getroles(){
  const queryString = "SELECT * From role";
  return new Promise((resolve, reject) => {
    connection.query(queryString, function(error, result) {
      if(error) {
        console.log(error);
      } else {
        resolve(result);
      }
    })
  })
}


function getscenario(){
  const queryString = "SELECT * From s_m_view";
  return new Promise((resolve, reject) => {
    connection.query(queryString, function(error, result) {
      if(error) {
        console.log(error);
      } else {
        resolve(result);
      }
    })
  })
}


function Getlogs(){
   const queryString = "SELECT DISTINCT * From logs";
  return new Promise((resolve, reject) => {
    connection.query(queryString, function(error, result) {
      if(error) {
        console.log(error);
      } else {
        resolve(result);
      }
    })
  })
}


function newReports(reportDetails) {
if (reportDetails.screenshot) {
        const screenshotPath = `./screenshots/${Date.now()}.png`;
        fs.writeFileSync(screenshotPath, reports.screenshot, 'base64');
        reportDetails.screenshotPath = screenshotPath;
    }
  const queryString = `
    INSERT INTO test_results (test_name, step_name, step_description, step_status,screenshotPath, executionTime, buildNo, browser_id, token) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
  `;

  // Array of values to be inserted
  const passedValues = [
    reportDetails.test_name,
    reportDetails.step_name,
    reportDetails.step_description,
    reportDetails.step_status,
    reportDetails.screenshotPath || null,
    reportDetails.executionTime,
    reportDetails.buildNo,
    reportDetails.browser_id,
    reportDetails.token
  ];

  // Return a promise for the database operation
  return new Promise((resolve, reject) => {
    connection.query(queryString, passedValues, function (error) {
      if (error) {
        console.log(error);
        reject(error); // Reject the promise with the error
      } else {
        resolve("success"); // Resolve the promise with success message
      }
    });
  });
}


module.exports = {
  getByModule,
  getTestCasesByModule,
  getAllDataFromTarget,
  getDasboardData,
  deleteUserById,
  getUsersForAdminPanel,
  createNewUser,
  createNewEnv,
  deleteEnvById,
  getenv,
  createNewLogs,
  updateEnv,
  getByobject,
  getByTestCase,
  Getlogs,
  getroles,
  getscenario,
  newReports,
  getByTestCases,
  getByCustomer
}