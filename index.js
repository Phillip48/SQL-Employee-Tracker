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
                    name: "Add An Employee",
                    value: "ADD_EMPLOYEE"
                },
                {
                    name: "Add A Department",
                    value: "ADD_DEPARTMENT"
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
    })
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
            choices: roles.map((roles) => { return {name: roles.title} })
        }
    ])
        .then(res => {
            let employee = res.department
            console.log(res.employee);
            connection.query(`INSERT INTO department (name) VALUES ("${employee}")`, (err, res) => {
                if (err) {
                    console.log(err);
                }
                console.log("\n");
                console.log('New employee was added!');
                console.log(res);
                console.log("\n");
                mainMenu();
            });
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
                console.log(res);
                console.log("\n");
                mainMenu();
            });
        })
}

function updateRole() {
    prompt([
        {
            type: "list",
            name: "update",
            message: "Which employees role would you like to update??",
            choices: []
        }
    ])
        .then(res => {
            const sql = `UPDATE employee SET employee = ? WHERE id = ?`;
            let answers = res.name

            connection.query(sql, (err, result) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                } else if (!result.affectedRows) {
                    res.json({
                        message: 'Employee not found'
                    });
                } else {
                    res.json({
                        message: 'success',
                        data: answers,
                        changes: result.affectedRows
                    });
                }
            });
        })
}

function quit() {
    console.log("Goodbye!");
    connection.end();
}

mainMenu();