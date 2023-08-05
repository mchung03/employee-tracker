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
            } else if(ans.action == 'view all employees') {
                viewEmployees()
            } else if(ans.action == 'add an employee') {
                addEmployee()
            } else if(ans.action == 'update an employee role') {
                updateEmployeeRole()
            }
        })
}

function viewDepartments() {
    db.query('SELECT * FROM department', function(err, data) {
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
function viewRoles() {
    db.query('SELECT * FROM role', function(err, data) {
        console.table(data)
        showPrompt()
    })
}
function addRole() {
    db.query(`SELECT * FROM department`, function(err, data) {
        if(err) {
            console.error(err);
            return;
        }
        const departmentNames = data.map((row) => row.name)
    inquirer
    .prompt([
        {
            type: 'input',
            message: 'What is the name of the role?',
            name: 'role_name'
        },
        {
            type: 'input',
            message: 'What is the salary of the role',
            name: 'salary'
        },
        {
            type: 'list',
            message: 'Choose the department of the role',
            name: 'department_name',
            choices: departmentNames
        }
    ])
    .then(ans => {
        const department = data.find((row) => row.name === ans.department_name);
        if(!department) {
            console.error('Department not found!');
            return;
        }
        const department_id = department.id;
        db.query(`INSERT INTO role(title, salary, department_id) VALUES (?,?,?)`, [ans.role_name, ans.salary, department_id], function(err, data){
            if(err) {
                console.error(err);
                return;
            }
            console.log('Role added!')
            showPrompt()
        })
    })
})
}
function viewEmployees() {
    db.query('SELECT * FROM employee', function(err, data) {
        console.table(data)
        showPrompt()
    })
}
function addEmployee() {
    db.query(`SELECT * FROM role`, function(err, roleData) {
        if(err) {
            console.error(err);
            return;
        }
        const roleName = roleData.map((row) => row.title)

        db.query(`SELECT * FROM employee`, function(err, managerData) {
            if(err) {
                console.error(err);
                return;
            }
            const managerName = managerData.map((row) => `${row.first_name} ${row.last_name}`); 

            inquirer
            .prompt([
                {
                    type: 'input',
                    message: 'What is the first name of the employee?',
                    name: 'first_name'
                },
                {
                    type: 'input',
                    message: 'What is the last name of the employee',
                    name: 'last_name'
                },
                {
                    type: 'list',
                    message: 'What role does this employee belong to?',
                    name: 'role_name',
                    choices: roleName
                },
                {
                    type: 'list',
                    message: 'Who is the manager of this employee?',
                    name: 'manager_name',
                    choices: managerName
                }
            ])
            .then(ans => {
                const role = roleData.find((row) => row.title === ans.role_name); 
                if(!role) {
                    console.error('Role not found!');
                    return;
                }
                const role_id = role.id;
                
                const manager = managerData.find((row) => `${row.first_name} ${row.last_name}` === ans.manager_name);

                let manager_id = null;

                if (manager) {
                    manager_id = manager.id;
                }

                db.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, [ans.first_name, ans.last_name, role_id, manager_id], function(err, data){
                    if(err) {
                        console.error(err);
                        return;
                    }
                    console.log('Employee added!')
                    showPrompt()
                })
            })
        })
        }
    )}
function updateEmployeeRole() {
    inquirer
    .prompt([
        {
            type: 'input',
            message: 'What is the name of the new role to replace?',
            name: 'role'
        }
    ])
    .then(ans => {
        db.query(`UPDATE employee SET role_id=?`, [ans.role], function(err, data){
            console.log('Employee role updated!')
            showPrompt()
        })
    })
}

showPrompt()