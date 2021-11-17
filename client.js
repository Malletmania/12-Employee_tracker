const inquirer = require('inquirer');
const fetch = require('node-fetch');

const startQuestion = [{
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

const addRole = [{
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