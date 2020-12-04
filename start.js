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

connection.connect((err) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
});

// list of options(kicks everything off)
function start() {
    console.log("Start inquirer prompts");
    // addDept();
    roleUpdate();
}

// add departments
function addDept() {
    console.log("add dept");
    let deptName = "Customer Service";

    connection.query(
        "INSERT INTO department SET ?",
        {
            name: deptName,
        },
        (err) => {
            if (err) throw err;
            console.log("Your department was successfully added!");
            // addRole();
            // start();
        }
    );
}

// add roles
function addRole() {
    console.log("add role");
    let title = "Sales Manager";
    let salary = 50000;
    let deptId = 1;

    connection.query(
        "INSERT INTO role SET ?",
        {
            title: title,
            salary: salary,
            department_id: deptId,
        },
        (err) => {
            if (err) throw err;
            console.log("Your role was successfully added!");
            addEmployee();
            // start();
        }
    );
}

// add employees
function addEmployee() {
    console.log("add employee");
    let firstName = "Joey";
    let lastName = "Bag O Donuts";
    let role = 1;
    let manager = 1;

    connection.query(
        "INSERT INTO employee SET ?",
        {
            first_name: firstName,
            last_name: lastName,
            role_id: role,
            manager_id: manager,
        },
        (err) => {
            if (err) throw err;
            console.log("Your employee was successfully added!");
            // start();
        }
    );
}

// view departments
function viewDept() {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        // console.log(res);
        var deptArray = [];
        for (var i = 0; i < res.length; i++) {
            deptArray.push(res[i].name);
            console.log(res[i].name);
        }
        return deptArray;
        // start();
    });
}

// view roles
function viewRoles() {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        // console.log(res);
        var rolesArray = [];
        for (var i = 0; i < res.length; i++) {
            rolesArray.push(res[i].title);
            console.log(res[i].title);
        }
        return rolesArray;
        // start();
    });
}

// view employees
function viewEmployees() {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        // console.log(res);
        let employeesArray = [];
        let employee = {};
        for (var i = 0; i < res.length; i++) {
            employee = {
                firstName: res[i].first_name,
                lastName: res[i].last_name,
            };
            employeesArray.push(employee);
        }
        return employeesArray;
        // start();
    });
}

// update employee roles
function roleUpdate() {
    // select all to loop through results for inq choices
    // connection.query("SELECT * FROM employee", (err, res) => {
    //     if (err) throw err;
    // console.log(res);
    let employeesArray = [];
    // let employee = {};
    // for (var i = 0; i < res.length; i++) {
    //     employee = {
    //         firstName: res[i].first_name,
    //         lastName: res[i].last_name,
    //     };
    //     employeesArray.push(employee);
    // }
    // start();

    let newId = 2;
    let employeeId = 3;
    connection.query(
        "UPDATE employee SET ? WHERE ?",
        [{ role_id: newId }, { id: employeeId }],
        (err, res) => {
            console.log("Your employee role was updated");
            // start();
        }
    );
    // });
}

// update employee manager
function managerUpdate() {
    let newId = 2;
    let employeeId = 3;
    connection.query(
        "UPDATE employee SET ? WHERE ?",
        [{ manager_id: newId }, { id: employeeId }],
        (err, res) => {
            console.log("Your employee manager was updated");
            // start();
        }
    );
}

// view employees under a manager

// delete departments

// delete roles

// delete employees

// view utilized budget for a department(add all salaries)
