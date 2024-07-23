const { query } = require("express");
const fs = require("fs");
var mysql = require("mysql");

var connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
  multipleStatements: true,
  timezone: "utc",
});

// cusotmer_view

// name, envName, instance_url, instance_username, instance_password, username`
function getAllDataFromTarget(target) {
  const queryString = `SELECT * from ${target}`;
  return new Promise((resolve, reject) => {
    connection.query(queryString, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        resolve(result);
      }
    });
  });
}

function getTestCasesByModule(moduleName) {
  // SQL query to get test cases based on the module name
  const queryString = `
    SELECT tcn.*
    FROM testcase tcn
    JOIN modules m ON tcn.Modules_id = m.id
    WHERE m.id = ?;
  `;

  // Return a promise that resolves with the result of the query
  return new Promise((resolve, reject) => {
    connection.query(queryString, [moduleName], function (error, result) {
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
  const queryString = `
SELECT
m.id AS Id,
m.name AS name
FROM
users u
INNER JOIN usermodulesaccess uma ON
u.id = uma.user_id
INNER JOIN modules m ON
m.id = uma.Modules_id
WHERE
u.id = ?;
`;

  // Return a promise that resolves with the result of the query
  return new Promise((resolve, reject) => {
    connection.query(queryString, [user_id], function (error, result) {
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
              // Process the result to the desired format
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
    connection.query(queryString, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        resolve(result);
      }
    });
  });
}

function deleteUserById(userId) {
  const queryString = "DELETE from Users WHERE id = ?";
  return new Promise((resolve, reject) => {
    connection.query(queryString, [userId], function (error) {
      if (error) {
        console.log(error);
      } else {
        resolve("success");
      }
    });
  });
}

function deleteEnvById(envId) {
  const queryString = "DELETE from Env WHERE id = ?";
  return new Promise((resolve, reject) => {
    connection.query(queryString, [envId], function (error) {
      if (error) {
        console.log(error);
      } else {
        resolve("success");
      }
    });
  });
}
function getUsersForAdminPanel() {
  const queryString = "SELECT id, username, role_id, created_at from Users";
  return new Promise((resolve, reject) => {
    connection.query(queryString, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        resolve(result);
      }
    });
  });
}
function getenv() {
<<<<<<< HEAD
  const queryString = "SELECT id,envName , user_Id, instance_url, instance_username, instance_password from Env";
=======
  const queryString =
    "SELECT id,envName , user_Id, module_id, instance_url, instance_username, instance_password from Env";
>>>>>>> 2d5de75 (env page and test case page)
  return new Promise((resolve, reject) => {
    connection.query(queryString, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        resolve(result);
      }
    });
  });
}

function createNewUser(userDetails, hashedPassword) {
  const queryString = "INSERT into Users VALUES ('', ?, ?, ?, ?)";
  const currentDate = new Date();
  const passedValues = [
    userDetails.username,
    hashedPassword,
    userDetails.role_id,
    currentDate,
  ];
  return new Promise((resolve, reject) => {
    connection.query(queryString, passedValues, function (error) {
      if (error) {
        console.log(error);
      } else {
        resolve("success");
      }
    });
  });
}
function createNewEnv(envDetails) {
  // SQL query for upsert (Insert or Update)
  const queryString = `
<<<<<<< HEAD
    INSERT INTO env (envName, user_id, instance_url, instance_username, instance_password) 
=======
    INSERT INTO env (envName, user_id, module_id, instance_url, instance_username, instance_password)
>>>>>>> 2d5de75 (env page and test case page)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  // Array of values to be inserted or updated
  const passedValues = [
    envDetails.envName,
    envDetails.user_id,
    envDetails.instance_url,
    envDetails.instance_username,
    envDetails.instance_password,
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
  const values = logs.map((log) => [
    log.test_name,
    formatDateTime(log.start_time),
    formatDateTime(log.end_time),
    log.test_status,
    log.build,
    log.job,
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
  const formattedDateTime = date.toISOString().slice(0, 19).replace("T", " ");
  return formattedDateTime;
}

function updateEnv(envDetails) {
  // SQL query for update
  const queryString = `
    UPDATE env
    SET envName = ?,
        user_id=?,
        instance_url=?,
        instance_username = ?,
        instance_password = ?
    WHERE id = ?;
  `;

  // Array of values to be updated
  const passedValues = [
    envDetails.envName,
    envDetails.user_id,
    envDetails.instance_url,
    envDetails.instance_username,
    envDetails.instance_password,
    envDetails.id,
  ];

  // Return a promise for the database operation
  return new Promise((resolve, reject) => {
    connection.query(queryString, passedValues, function (error, results) {
      if (error) {
        console.log(error);
        reject(error); // Reject the promise with the error
      } else {
        resolve(results.affectedRows); // Resolve with the number of affected rows
      }
    });
  });
}

function getByTestCase(test_name) {
  const queryString = "SELECT Test_Case, component_name, Description, cammand as Command, Target, Value FROM flow_view WHERE Test_Case=?";

  return new Promise((resolve, reject) => {
<<<<<<< HEAD
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
=======
    connection.query(queryString, [test_case], function (error, results) {
      if (error) {
        reject(error);
      } else {
        const componentName = results.map((result) => result.componentName);
        const resultObject = {
          Test_Case: test_case,
          componentName: componentName,
        };
        resolve(resultObject);
>>>>>>> 2d5de75 (env page and test case page)
      }
    });
  });
}
<<<<<<< HEAD


// function getBytest_case(test_case) {
// const queryString = "SELECT Test_Case,component_name,Description,cammand as Command,Target,VALUE FROM flow_view WHERE Test_Case=?";
//   return new Promise((resolve, reject) => {
//     connection.query(queryString, [test_case], function(error, results) {
//       if (error) {
//         reject(error);
//       } else {
//         const componentName = results.map(result => result.componentName);
//         const resultObject = {
//           Test_Case: test_case,
//           componentName: componentName
//         };
//         resolve(resultObject);
//       }
//     });
//   });
// }
function getByobject() {
  const queryString = "SELECT * FROM objects_view";
  return new Promise((resolve, reject) => {
    connection.query(queryString, function(error, results) {
      if (error) {
        reject(error);
      } else {
        resolve(results);
=======
function getByflow(flow) {
  const queryString =
    "SELECT Description, Cammand, Target, Value FROM compview WHERE componentName=?";
  return new Promise((resolve, reject) => {
    connection.query(queryString, [flow], function (error, results) {
      if (error) {
        reject(error);
      } else {
        // Map SQL query results to an array of objects
        const componentSteps = results.map((result) => {
          return {
            Cammand: result.Cammand,
            Description: result.Description,
            Target: result.Target,
            Value: result.Value,
          };
        });

        // Construct the result object
        const resultObject = {
          [flow]: componentSteps,
        };

        resolve(resultObject);
>>>>>>> 2d5de75 (env page and test case page)
      }
    });
  });
}

function getroles() {
  const queryString = "SELECT * From role";
  return new Promise((resolve, reject) => {
    connection.query(queryString, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        resolve(result);
      }
    });
  });
}
<<<<<<< HEAD
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
   const queryString = "SELECT * From logs";
=======
function Getlogs() {
  const queryString = "SELECT * From logs";
>>>>>>> 2d5de75 (env page and test case page)
  return new Promise((resolve, reject) => {
    connection.query(queryString, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        resolve(result);
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
<<<<<<< HEAD
  getByobject,
  getByTestCase,
  Getlogs,
  getroles,
  getscenario,
}
=======
  getByflow,
  getBytest_case,
  Getlogs,
  getroles,
  getByCustomer
};
>>>>>>> 2d5de75 (env page and test case page)
