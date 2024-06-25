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


module.exports = {
  getByModule,
  getTestCasesByModule,
  getAllDataFromTarget,
  getDasboardData,
  deleteUserById,
  getUsersForAdminPanel,
  createNewUser
};
