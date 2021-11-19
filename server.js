const { json } = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const dotenv = require('dotenv').config();

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASS,
    database: 'employeetracker_db'
  },
  console.log(`Connected to employeetracker_db.`)
);

const startQuestions = [{
  type: 'list',
  message: "Select from the choices below to begin.",
  choices: ['view all departments', 'view all roles', 'view all employees', 'add department', 'add role', 'add employee', 'update employee'],
  name: 'title'
}];

const addDepartment = [{
  type: 'input',
  message: "Add name of department you'd like to add.",
  name: 'newDepartment'
}];

const addEmployeeRole = [{
  type: 'input',
  message: 'Add new role below',
  name: 'roleName'
},
{
  type: 'input',
  message: 'Add salary compensation below',
  name: 'roleSalary'
},
{
  type: 'input',
  message: 'Add department ID beloew',
  name: 'roleDept'
}
];

const addQuestions = [{
  type: 'input',
  message: 'Enter employees First nane',
  name: 'fname'
},
{
  type: 'input',
  message: 'Enter employees Last name',
  name: 'lname'
},
{
  type: 'input',
  message: "Enter employees role",
  name: 'role'
},
{
  type: 'input',
  message: "Enter employees manager below",
  name: 'manager'
},
];

const updateEmp = [{
  type: 'input',
  message: 'Enter employees new role below',
  name: 'updateRole'
}]

function viewDepartment() {
  console.log("viewDepartment init")
  let sql = `SELECT * FROM departments`;
  db.query(sql, (err, rows) => {
    if(err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.log(rows)
  });
  init()
}

function viewRoles() {
  console.log("viewRole init")
  let sql = `SELECT * FROM roles`;
  db.query(sql, (err, rows) => {
    if(err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.log(rows)
  });
  init()
}
// revisit
function viewEmp() {
  console.log("viewEmp init")
  let sql = `SELECT employee.id, employee.emp_first_name, employee.emp_last_name, emp_role.role_title, department.dept_name, CONCAT(manager.emp_first_name, " ", manager.emp_last_name) AS manager From employee
  
  LEFT JOIN roles ON employee.emp_role_id = emp_role.id
  LEFT JOIN department ON emp_role.role_dept_id = department.id
  LEFT JOIN employee manager ON emp_manager.id = employee`;

  db.query(sql, (err, rows) => {
    if(err) {
        console.log(err)
        // res.status(500).json({ error: err.message });
   return;
   }
        console.log(rows)
        init()
   });
}
// revisit

function addEmp() {
  console.log("addEmployee triggers")
  inquirer.prompt(addQuestions)
  .then(resp => {
    db.query('INSERT INTO employee (emp_first_name, emp_last_name, emp_role_id, emp_manager_id) VALUES (?, ?, ?, ?)', [res.fname, resp.lname, resp.role, resp.manager],
    function (err, result) {
      if (result){
        console.log("Employee added.");
        init();
      } else {
        console.log(err)
        console.log("Error!");
        init();
      }
    })
  })
}

function addRole() {
  console.log("addRole init")
  inquirer.prompt(addEmployeeRole)
  .then(resp => {
    db.query('INSERT INTO roles (role_title, role_salary, role_dept_id) VALUES (?, ?, ?)', [resp.roleName, resp.roleSalary, resp.roleDept],
    function (err, result) {
      if (result){
        console.log("Role has been added");
        init();
      } else {
        console.log(err)
        console.log("Error");
        init();
      }
    })
  })
}

function addDepartments() {
  console.log("addDepartments init")
  inquirer.prompt(addDepartment)
  .then(resp => {
    db.query('INSERT INTO (dept_name) VALUES (?)', [resp.newDepartment],
    function (err, result) {
      if (result){
        console.log("Department added.");
        init();
      } else {
        console.log(err)
        console.log("Error");
        init();
      }
    })
  })
}

function updateEmployee() {
  let sql1 = `SELECT employee.emp_first_name, employee.emp_last_name from employee`
  db.query(sql1, (err, rows) => {
    rows = rows.map( function(employee) {
      return employee.emp_first_name + " " + employee.emp_last_name
    })
    employeeUpdate =
    {
      type: 'list',
      message: "Select employee you'd like to update",
      choices: rows,
      name: 'updateEmployee'
    }
    inquirer.prompt(employeeUpdate)
    return employeeUpdate
  })

  let sql2 = `SELECT emp_role.role_title FROM emp_role`
  db.query(sql2, (err, rows) => {
    rows = rows.map( function(role) {
      return role.title
    })
    roleUpdate =
    {
      type: 'list',
      message: 'Which role would you like to select?',
      choices: rows,
      name: 'updateRole'
    }
    inquirer.prompt(roleUpdate)
    return roleUpdate
  })
}

function init() {
  inquirer.prompt(startQuestions)
  .then(resp => {
      if(resp.init === 'View Employees') {
          viewEmp()
      }
      else if(resp.init === 'View Departments') {
          viewDepartment()
      }
      else if(resp.init === 'View Roles') {
          viewRoles()
      }
      else if(resp.init === 'Add Employee') {
          addEmp()
      }
      else if(resp.init === 'Add Role') {
          addRole()
      }
      else if(resp.init === 'Add Department') {
          addDepartments()
      }
      else if(resp.init === 'Update Employee') {
          updateEmployee()
      }

  })
}
init()