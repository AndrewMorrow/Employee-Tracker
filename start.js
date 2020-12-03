const mysql = require("mysql");
const inq = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "12345",
    database: "employeetracker_db",
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});

// list pf options

// add departments

// add roles

// add employees

// view departments

// view roles

// view employees

// update employee roles

// update employee manager

// view employees under a manager

// delete departments

// delete roles

// delete employees

// view utilized budget for a department(add all salaries)
