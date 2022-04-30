const { table } = require("console");
const mysql = require("mysql2");
const { prompt } = require("inquirer");
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
    ]).then(res => {
        //call function dpeending on what the user chooses
        // if conditional or switch case or when
        let choices = res.choices;
        if (choices == "VIEW_EMPLOYEES") {
            //call function
            viewEmployees();
        } else if (choices == "VIEW_DEPARTMENTS") {
            //call function
            viewDeparments()
        } else if (choices == "VIEW_ROLES") {
            viewRoles()
        } else if (choices == "ADD_EMPLOYEE") {
            //call function
            addEmployee()
        } else if (choices == "ADD_DEPARTMENT") {
            //call function
            addDepartment()
        } else if (choices == "UPDATE_ROLE") {
            //call function
            updateRole()
        } else if (choices == "QUIT") {
            quit();
        }

    })
}

// View employees
function viewEmployees() {
    connection.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            console.log("\n");
            console.table(employees)
        })
        .then(() => mainMenu())
}
// View departments
function viewDeparments() {
    connection.findAllDepartments()
        .then(([rows]) => {
            let Departments = rows;
            console.log("\n");
            console.table(Departments)
        })
        .then(() => mainMenu())
}
// View roles
function viewRoles() {
    connection.findAllRoles()
        .then(([rows]) => {
            let roles = rows;
            console.log("\n");
            console.table(roles)
        })
        .then(() => mainMenu())
}

// Add an emploee
function addEmployee() {
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
            type: "input",
            name: "employeeRole",
            message: "What is the employees role?"
        },
        {
            type: "input",
            name: "employeeManager",
            message: "Who is the employees manager?"
        }
    ])
        .then(res => {
            let answers = res.name
            console.log(answers);
            const sql =
                `INSERT INTO employees
        (first_name, last_name, role_id)
        VALUES
        (${answers.first_name}, ${answers.last_name}, ${answers.role_id})`

            connection.query(sql, (err, res) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                    return;
                }
                res.json({
                    message: 'success',
                    data: body
                });
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
            let answers = res.name
            console.log(answers);
            const sql =
                `INSERT INTO department
        (name)
        VALUES
        (${answers.name})`

        connection.query(sql, (err, res) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                    return;
                }
                res.json({
                    message: 'success',
                    data: body
                });
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
    process.quit();
}

mainMenu();