// const { table } = require("console");
const mysql = require("mysql2");
const { prompt } = require("inquirer");
// const { resolveObjectURL } = require("buffer");
// const db = require("./db");
// require("console.table");

// Create db connection 
const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Pereira1967!',
        database: 'employees'
    },
    console.log(`Connected to the employees database.`)
);

// Error handling for messed up connection
connection.connect(function (err) {
    if (err) throw err;
});


function mainMenu() {
    console.log("Welcome to Employee Tracker!");
    prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: [
                {
                    name: "View All Employees",
                    value: "VIEW_EMPLOYEES"
                },
                {
                    name: "View All Departments",
                    value: "VIEW_DEPARTMENTS"
                },
                {
                    name: "View All Roles",
                    value: "VIEW_ROLES"
                },
                {
                    name: "Add A New Employee",
                    value: "ADD_EMPLOYEE"
                },
                {
                    name: "Add A New Department",
                    value: "ADD_DEPARTMENT"
                },
                {
                    name: "Add A New Role",
                    value: "ADD_ROLE"
                },
                {
                    name: "Update An Employee Role",
                    value: "UPDATE_ROLE"
                },
                {
                    name: "Quit",
                    value: "QUIT"
                }
            ]
        }
    ])
        .then(data => {
            //call function dpeending on what the user chooses
            // if conditional or switch case or when
            // let choices = data.choices;
            switch (data.choice) {
                case "VIEW_EMPLOYEES":
                    viewEmployees();
                    break;
                case "VIEW_DEPARTMENTS":
                    viewDeparments();
                    break;
                case "VIEW_ROLES":
                    viewRoles();
                    break;
                case "ADD_EMPLOYEE":
                    addEmployee();
                    break;
                case "ADD_DEPARTMENT":
                    addDepartment();
                    break;
                case "ADD_ROLE":
                    addRole();
                    break;
                case "UPDATE_ROLE":
                    updateRole();
                    break;
                default: quit();
            }
        })
}

// View employees
function viewEmployees() {
    connection.query(
        `SELECT * FROM employees.employee`, (err, results) => {
            if (err) {
                console.log(err);
            }
            console.log("\n")
            console.table(results);
            console.log("\n")
            mainMenu();
        }
    )
}
// View departments
function viewDeparments() {
    connection.query(
        `SELECT * FROM employees.department`, (err, results) => {
            if (err) {
                console.log(err);
            }
            console.log("\n")
            console.table(results);
            console.log("\n")
            mainMenu();
        }
    )
}
// View roles
function viewRoles() {
    connection.query(
        `SELECT * FROM employees.role`, (err, results) => {
            if (err) {
                console.log(err);
            }
            console.log("\n")
            console.table(results);
            console.log("\n")
            mainMenu();
        }
    )
}

// Add an emploee
function addEmployee() {
    let roles = connection.query(`SELECT * FROM employees.role`, (err, res) => {
        if (err) {
            console.log(err);
        }
        // let obj = Object.getOwnPropertyNames(res);
        // console.log(obj);
        // let roleTitle = JSON.stringify(res[0].title);
        // console.log(roleTitle);
        // res.map((roles) => {
        //     return {name: roles.title}
        // })

        prompt([
            {
                type: "input",
                name: "firstName",
                message: "What is the employees first name?"
            },
            {
                type: "input",
                name: "lastName",
                message: "What is the employees last name?"
            },
            {
                type: "list",
                name: "employeeRole",
                message: "What is the employees role?",
                choices:
                    res.map((roles) => {
                        return {
                            name: roles.title,
                            value: roles.id
                        }
                    })
                // res.map(roles => {
                //     for (let i = 0; i < roles.length; i++) {
                //         roles.title[i];

                //     }
                // })
            }
        ])
            .then(res => {
                // let employee = res.employeeRole;
                // console.log(res);
                // console.log(res.employeeRole.value);
                connection.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES ("${res.firstName}", "${res.lastName}", ${res.employeeRole})`, (err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log("\n");
                    console.log('New employee was added!');
                    console.log("\n");
                    mainMenu();
                });
            })
    })
}

// Add a department
function addDepartment() {
    prompt([
        {
            type: "input",
            name: "department",
            message: "What is the name of the department?"
        }
    ])
        .then(res => {
            let department = res.department
            console.log(res.department);
            connection.query(`INSERT INTO department (name) VALUES ("${department}")`, (err, res) => {
                if (err) {
                    console.log(err);
                }
                console.log("\n");
                console.log('New department was made!');
                console.log("\n");
                mainMenu();
            });
        })
}

function addRole() {
    let departments = connection.query(`SELECT * FROM employees.department`, (err, res) => {
        if (err) {
            console.log(err);
        }
        prompt([
            {
                type: "input",
                name: "roleName",
                message: "What is the name of the role?"
            },
            {
                type: "input",
                name: "roleSalary",
                message: "What is the salary of the role?"
            },
            {
                type: "list",
                name: "roleDepartment",
                message: "What department does this role belong to?",
                choices:
                    res.map((departments) => {
                        return {
                            name: departments.name,
                            value: departments.id
                        }
                    })
            }
        ])
            .then(res => {
                connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${res.roleName}", ${res.roleSalary}, ${res.roleDepartment})`, (err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log("\n");
                    console.log('New role was added!');
                    console.log("\n");
                    mainMenu();
                });
            })
    })
}

function updateRole() {
    let update = connection.query(`SELECT employee.first_name AS firstname, employee.last_name AS lastname, employee.id AS employeeID, employee.role_id AS empRole, role.title AS role FROM employee JOIN role ON employee.role_id = role.id`, (err, res) => {
        if (err) {
            console.log(err);
        }
        prompt([
            {
                type: "list",
                name: "updateName",
                message: "Which employees role would you like to update?",
                choices:
                    res.map((update) => {
                        return {
                            name: `${update.firstname} ${update.lastname}`,
                            value: `${update.employeeID}`
                        }
                    })
            },
            {
                type: "list",
                name: "newRole",
                message: "Which role would you like to give this employee?",
                choices:
                    res.map((update) => {
                        return {
                            name: `${update.role}`,
                            value: `${update.empRole}`
                        }
                    })
            }
        ])
            .then(res => {
                connection.query(`UPDATE employee SET role_id = ${res.newRole} WHERE id = ${res.updateName};`, (err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log("\n");
                    console.log('Employee role was updated!');
                    console.log("\n");
                    mainMenu();
                });
            })
    })

}

// const employeeRole = function () {
//     let employeeRoles = connection.query(`SELECT * FROM employees.role`, (err, res) => {
//         if (err) {
//             console.log(err);
//         }
//         res.map(() => {
//             return {
//                 name: employeeRoles.title,
//                 value: employeeRoles.department_id
//             }
//         })
//     })
// }

function quit() {
    console.log("Goodbye!");
    connection.end();
}
// Call function to start Tracker
mainMenu();