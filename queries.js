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
    SELECT tcn.*
    FROM testcase tcn
    JOIN Modules m ON tcn.Modules_Id = m.Id
    WHERE m.Id = ?;
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
  const queryString = `
SELECT
    m.Id As Id,
    m.name AS name
FROM 
    users u
INNER JOIN 
    usermodulesaccess uma ON u.id = uma.user_id
INNER JOIN 
    Modules m ON m.Id = uma.Modules_id
WHERE 
    u.id = ?;
`;

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
  const queryString = "DELETE from Users WHERE id = ?";
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
  const queryString = "DELETE from Env WHERE id = ?";
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
  const queryString = "SELECT id, username, Role_Id, created_at from Users";
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
  const queryString = "SELECT id,envName , user_Id, module_id, instance_url, instance_username, instance_password from Env";
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
    INSERT INTO env (envName, user_id, module_id, instance_url, instance_username, instance_password) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  // Array of values to be inserted or updated
  const passedValues = [
    envDetails.envName,
    envDetails.user_id,
    envDetails.module_id,
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
  // SQL query for update
  const queryString = `
    UPDATE env 
    SET envName = ?,
        user_id=?, 
        module_id = ?, 
        instance_url=?,
        instance_username = ?, 
        instance_password = ?
    WHERE id = ?;
  `;

  // Array of values to be updated
  const passedValues = [

    envDetails.envName,
    envDetails.user_id,
    envDetails.module_id,
    envDetails.instance_url,
    envDetails.instance_username,
    envDetails.instance_password,
    envDetails.id
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

function getBytest_case(test_case) {
  const queryString = "SELECT componentName FROM flowview WHERE Test_Case=?";
  return new Promise((resolve, reject) => {
    connection.query(queryString, [test_case], function(error, results) {
      if (error) {
        reject(error);
      } else {
        const componentName = results.map(result => result.componentName);
        const resultObject = {
          Test_Case: test_case,
          componentName: componentName
        };
        resolve(resultObject);
      }
    });
  });
}
function getByflow(flow) {
  const queryString = "SELECT Description, Cammand, Target, Value FROM compview WHERE componentName=?";
  return new Promise((resolve, reject) => {
    connection.query(queryString, [flow], function(error, results) {
      if (error) {
        reject(error);
      } else {
        // Map SQL query results to an array of objects
        const componentSteps = results.map(result => {
          return {
            Cammand: result.Cammand,
            Description: result.Description,
            Target: result.Target,
            Value: result.Value
          };
        });

        // Construct the result object
        const resultObject = {
          [flow]: componentSteps
        };

        resolve(resultObject);
      }
    });
  });
}

function Getlogs(){
   const queryString = "SELECT * From logs";
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
  updateEnv,getByflow,
  getBytest_case,
  Getlogs
}
