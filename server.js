const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table')

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employee_db'
    },
    console.log(`Connected to employee_db`)
)
db.connect(function(err) {
    if(err) {
        console.log(err)
    }
})

function showPrompt() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                name: 'action',
                choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
            }
        ])
        .then(ans => {
            if(ans.action == 'view all departments') {
                viewDepartments()
            } else if(ans.action == 'add a department') {
                addDepartments()
            } else if(ans.action == 'view all roles') {
                viewRoles()
            } else if(ans.action == 'add a role') {
                addRole()
            }
        })
}
function viewDepartments() {
    db.query('SELECT * FROM department', function(err, data) {
        console.table(data)
        showPrompt()
    })
}
function viewRoles() {
    db.query('SELECT * FROM role', function(err, data) {
        console.table(data)
        showPrompt()
    })
}
function addDepartments() {
    inquirer
    .prompt([
        {
            type: 'input',
            message: 'What is the name of the department?',
            name: 'department_name'
        }
    ])
    .then(ans => {
        db.query(`INSERT INTO department(name) VALUES (?)`, [ans.department_name], function(err, data){
            console.log('Department added!')
            showPrompt()
        })
    })
}
function addRole() {
    inquirer
    .prompt([
        {
            type: 'input',
            message: 'What is the name of the role?',
            name: 'role_name'
        }
    ])
    .then(ans => {
        db.query(`INSERT INTO role(name) VALUES (?)`, [ans.role_name], function(err, data){
            console.log('Role added!')
            showPrompt()
        })
    })
}

showPrompt()