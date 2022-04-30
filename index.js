const { table } = require("console");
const {prompt} = require("inquirer");
const db = require("./db");
require("console.table");

function mainMenu() {
    prompt([
        {
            type: "List",
            name: "choice",
            message: "What would you like to do?",
            choices: [
                {
                    name: "View All Employees",
                    value: "VIEW_EMPLOYEES"
                },
                // view employees, departments, roles
                // add employees, department 
                //update employee role
                {
                    name: "",
                    value: ""
                },
                {
                    name: "",
                    value: ""
                },
                {
                    name: "",
                    value: ""
                },
                {
                    name: "",
                    value: ""
                },
                {
                    name: "",
                    value: ""
                },
                {
                    name: "",
                    value: ""
                },
                {
                    name: "Quit",
                    value: "QUIT"
                }
            ]
        }
    ]).then(res => {
        let choices = res.choices;
        //call function dpeending on what the user chooses
        // if conditional or switch case or when
    })
}



function viewEmployees() {
    db.findAllEmployees()
    .then(([rows]) => {
        let employees = rows; 
        console.log("\n");
        console.table(employees)
    })
    .then(() => mainMenu())
}

function quit() {
    console.log("Goodbye!");
    process.quit();
}