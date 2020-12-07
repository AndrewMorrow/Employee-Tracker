const mysql = require("mysql");
const inq = require("inquirer");
const cTable = require("console.table");

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
    inq.prompt({
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
            "Add a department",
            "Add a role",
            "Add an employee",
            "View all departments",
            "View all roles",
            "View all employees",
            "Update an employee role",
            "Update an employee's manager",
            "Delete a department",
            "Delete a role",
            "None",
        ],
    }).then(function (answer) {
        switch (answer.action) {
            case "Add a department":
                addDept();
                break;

            case "Add a role":
                addRole();
                break;

            case "Add an employee":
                addEmployee();
                break;

            case "View all departments":
                viewDepts();
                break;

            case "View all roles":
                viewRoles();
                break;

            case "View all employees":
                viewEmployees();
                break;

            case "Update an employee role":
                updateRole();
                break;
            case "Update an employee's manager":
                updateManager();
                break;

            case "Delete a department":
                deleteDept();
                break;

            case "Delete a role":
                deleteRole();
                break;

            case "Delete a employee":
                deleteEmployee();
                break;

            case "None":
                console.log("Thank you for using employee tracker!");
                connection.end();
                break;
        }
    });
}

// add departments
function addDept() {
    inq.prompt({
        name: "newDept",
        type: "input",
        message: "What is the department name would you like to add?",
    }).then((answer) => {
        connection.query(
            "INSERT INTO department SET ?",
            {
                name: answer.newDept,
            },
            (err) => {
                if (err) throw err;
                console.log("Your department was successfully added!");

                start();
            }
        );
    });
}

// add roles
function addRole() {
    inq.prompt([
        {
            name: "title",
            type: "input",
            message: "What is the title of your new role?",
        },
        {
            name: "salary",
            type: "input",
            message: "What is the yearly salary of your new role?",
        },
        {
            name: "deptName",
            type: "input",
            message:
                "What is the name of the department this role will be assigned to?",
        },
    ]).then((answer) => {
        connection.query("SELECT * FROM department", (err, res) => {
            if (err) throw err;
            const deptId = findDeptId(answer, res);
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: deptId,
                },
                (err) => {
                    if (err) throw err;
                    console.log("Your role was successfully added!");
                    start();
                }
            );
        });
    });
}

function findDeptId(answer, res) {
    for (var i = 0; i < res.length; i++) {
        if (res[i].name === answer.deptName) {
            return res[i].id;
        }
    }
}

// add employees
function addEmployee() {
    let roleArray = [];
    connection.query("SELECT * FROM role", (err, res) => {
        inq.prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is the employee's first name?",
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the employee's last name?",
            },
            {
                name: "role",
                type: "rawlist",
                choices: () => {
                    if (err) throw err;

                    for (var i = 0; i < res.length; i++) {
                        roleArray.push(res[i].title);
                    }
                    return roleArray;
                },
                message: "What is the employee's role?",
            },
        ]).then((answer) => {
            let indexRole = roleArray.indexOf(answer.role);
            let role = res[indexRole].id;
            let firstName = answer.firstName;
            let lastName = answer.lastName;
            let managerArray = [];
            connection.query("SELECT * FROM employee", (err, res) => {
                if (err) throw err;
                inq.prompt([
                    {
                        name: "manager",
                        type: "rawlist",
                        choices: () => {
                            for (var i = 0; i < res.length; i++) {
                                managerArray.push(
                                    `${res[i].first_name} ${res[i].last_name}`
                                );
                            }
                            return managerArray;
                        },
                        message: "Who is the employee's manager?",
                    },
                ]).then((answer) => {
                    let indexMan = managerArray.indexOf(answer.manager);
                    let managerId = res[indexMan].id;

                    connection.query(
                        "INSERT INTO employee SET ?",
                        {
                            first_name: firstName,
                            last_name: lastName,
                            role_id: role,
                            manager_id: managerId,
                        },
                        (err) => {
                            if (err) throw err;
                            console.log(
                                "Your employee was successfully added!"
                            );
                            start();
                        }
                    );
                });
            });
        });
    });
}

// function getEmployeeRole(firstName, lastName) {
//     connection.query("SELECT * FROM role", (err, res) => {
//         if (err) throw err;
//         let roleArray = [];
//         for (var i = 0; i < res.length; i++) {
//             roleArray.push(res[i].title);
//         }

//         inq.prompt([
//             {
//                 name: "role",
//                 type: "rawlist",
//                 choices: roleArray,
//                 message: "What is the employee's role?",
//             },
//         ]).then((answer) => {
//             let role = answer.role;
//             getEmployeeManager(firstName, lastName, role);
//         });
//     });
// }

// function getEmployeeManager(firstName, lastName, role) {
//     connection.query("SELECT * FROM employee", (err, res) => {
//         if (err) throw err;

//         inq.prompt([
//             {
//                 name: "manager",
//                 type: "rawlist",
//                 choices: () => {
//                     let managerArray = ["None"];
//                     for (var i = 0; i < res.length; i++) {
//                         managerArray.push(
//                             `${res[i].first_name} ${res[i].last_name}`
//                         );
//                     }
//                     return managerArray;
//                 },
//                 message: "Who is the employee's manager?",
//             },
//         ]).then((answer) => {
//             let manager = answer.manager;
//         });
//     });
// }

// view departments
function viewDepts() {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        // console.log(res);
        var deptArray = [];
        for (var i = 0; i < res.length; i++) {
            deptArray.push(res[i].name);
            // console.log(res[i].name);
        }
        // console.log(deptArray);

        console.table("Departments", [deptArray]);
        // return deptArray;
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
        }
        console.table("Roles", [rolesArray]);
        // return rolesArray;
        start();
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
            // employee = {
            //     firstName: res[i].first_name,
            //     lastName: res[i].last_name,
            // };
            employeesArray.push(`${res[i].first_name} ${res[i].last_name}`);
        }
        console.table("Employees", [employeesArray]);
        // return employeesArray;
        start();
    });
}

// update employee roles
function updateRole() {
    let employeeArray = ["None"];
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        // console.log(res);
        inq.prompt([
            {
                name: "selection",
                type: "rawlist",
                choices: () => {
                    for (var i = 0; i < res.length; i++) {
                        employeeArray.push(
                            `${res[i].first_name} ${res[i].last_name}`
                        );
                    }
                    return employeeArray;
                },
                message: "Which employee's role would you like to update?",
            },
        ]).then((answer) => {
            // console.log(res);
            var rolesArray = ["None"];
            let indexEmp = employeeArray.indexOf(answer.selection) - 1;
            // console.log(indexEmp);
            let employeeId = res[indexEmp].id;

            connection.query("SELECT * FROM role", (err, res) => {
                if (err) throw err;

                inq.prompt([
                    {
                        name: "roleChange",
                        type: "rawlist",
                        choices: () => {
                            for (var i = 0; i < res.length; i++) {
                                rolesArray.push(res[i].title);
                            }
                            return rolesArray;
                        },
                        message:
                            "Which role would you like to change the employee to?",
                    },
                ]).then((answer) => {
                    let indexId = rolesArray.indexOf(answer.roleChange) - 1;
                    let newRoleId = res[indexId].id;
                    console.log(newRoleId);
                    connection.query(
                        "UPDATE employee SET ? WHERE ?",
                        [{ role_id: newRoleId }, { id: employeeId }],
                        (err, res) => {
                            console.log("Your employee role was updated");
                            start();
                        }
                    );
                });
            });
        });
    });
}
//  select all to loop through results for inq choices

// let employeesArray = [];
//  let employee = {};
//  for (var i = 0; i < res.length; i++) {
//      employee = {
//          firstName: res[i].first_name,
//          lastName: res[i].last_name,
//      };
//      employeesArray.push(employee);
//  }
// start();

// let newId = 2;
// let employeeId = 3;
// connection.query(
//     "UPDATE employee SET ? WHERE ?",
//     [{ role_id: newId }, { id: employeeId }],
//     (err, res) => {
//         console.log("Your employee role was updated");
//         // start();
//     }
// );
// });

// update employee manager
function updateManager() {
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

// view employees under a manager(join)

// delete departments
function deleteDept() {
    let dept = 1;
    connection.query(
        "DELETE FROM department WHERE ?",
        {
            id: dept,
        },
        (err, res) => {
            if (err) throw err;
            console.log("Your dept has been deleted.");
        }
    );
}

// delete roles
function deleteRole() {
    let role = 2;
    connection.query(
        "DELETE FROM role WHERE ?",
        {
            id: role,
        },
        (err, res) => {
            if (err) throw err;
            console.log("Your role has been deleted.");
        }
    );
}

// delete employees
function deleteEmployee() {
    let employeeId = 3;
    connection.query(
        "DELETE FROM employee WHERE ?",
        {
            id: employeeId,
        },
        (err, res) => {
            if (err) throw err;
            console.log("Your employee has been deleted.");
        }
    );
}

// view utilized budget for a department(add all salaries)(join)
