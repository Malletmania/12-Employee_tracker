const { json } = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const dotenv = require('dotenv').config();

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASS,
    database: 'employee_db'
  },
  // console.log(`Connected to employee_db.`)
);

const startQuestions = {
  type: 'list',
  message: "Select from the choices below to begin.",
  choices: [
  {
    name:'view all departments',
    value: "view_departments"
  }, 
  {
    name:'view all roles',
    value: "view_roles"
  }, 
  {
    name:'view all employees',
    value: "view_employees"
  }, 
  {
    name:'add department',
    value: "add_departments"
  }, 
  {
    name:'add role',
    value: "add_role"
  }, 
  {
    name:'add employee',
    value: "add_employee"
  }, 
  {
    name:'update employee',
    value: "update_employee"
  }
],
  name: 'title'
};

const addDepartment = {
  type: 'input',
  message: "Add name of department you'd like to add.",
  name: 'newDepartment'
};

const addEmployeeRole = [{
  type: 'input',
  message: 'Add new role below',
  name: 'roleName'
}, 
{
  type: 'input',
  message: 'Add salary compensation below',
  name: 'roleSalary',
  validate(a){
    const n = parseInt(a, 10);
    if (isNaN(n)){
      return "must input a number"
    };
    return true;
  }
},
{
  type: 'input',
  message: 'Add department ID beloew',
  name: 'roleDept'
}];

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
}];

const updateEmp = {
  type: 'input',
  message: 'Enter employees new role below',
  name: 'updateRole'
}

async function viewDepartment() {
  console.log("viewDepartment init")
  let sql = `SELECT
  department.id AS id,
  department.dept_name AS name
  FROM department`;
  const[departments] = await db.promise().query(sql)
  console.table(departments)
  // for (const department of departments) {
  //   console.log(`role title: ${role.title} salary: ${role.salary} department name: ${role.department}`)
  // }

}

async function viewRoles() {
  console.log("viewRole init")
  let sql = `SELECT
  emp_role.role_title AS title,
  emp_role.role_salary AS salary,
  department.dept_name AS department
  FROM emp_role
  JOIN department ON (emp_role.role_dept_id = department.id)`;
  const[roles] = await db.promise().query(sql)
  // for (const role of roles) {
  //   console.log(`role title: ${role.title} salary: ${role.salary} department name: ${role.department}`)
  // }
  // init()
  console.table(roles)
}
// revisit
async function viewEmp() {
  console.log("viewEmp init")
  let sql = `SELECT employee.id, employee.emp_first_name, employee.emp_last_name, emp_role.role_title, department.dept_name, CONCAT(manager.emp_first_name, " ", manager.emp_last_name) AS manager From employee
  
  LEFT JOIN emp_role ON employee.emp_role_id = emp_role.id
  LEFT JOIN department ON emp_role.role_dept_id = department.id
  LEFT JOIN employee manager ON manager.id = employee.id`;

  const [employees] = await db.promise().query(sql) 
//   for (const employee of employees) {
//     console.log(`
// Employee ID: ${employee.id}
//     Name: ${employee.emp_first_name} ${employee.emp_lastName}
//     Role: ${employee.role_title}
//     Manager: ${employee.manager}
//     Department: ${employee.dept_name}
// `);
//   }
console.table(employees)
}
// revisit

async function addEmp() {
  console.log("addEmployee triggers")
  const {fname, lname, role, manager} = await inquirer.prompt(addQuestions)
  const [data] = await db.promise().query(
    `
        (
            SELECT id FROM (
                SELECT emp_role.id AS id FROM emp_role WHERE UPPER(emp_role.role_title) = UPPER(?)
                    UNION
                SELECT null AS id
            ) AS r
            LIMIT 1
        )
    UNION ALL
        (
             SELECT id FROM (
                 SELECT
                     employee.id
                 FROM
                     employee
                 WHERE
                    UPPER(CONCAT(employee.emp_first_name, ' ', employee.emp_last_name)) = UPPER(?) OR
                    UPPER(employee.emp_first_name) = UPPER(?) OR
                    UPPER(employee.emp_last_name) = UPPER(?)
                 UNION SELECT null AS id
             ) as m limit 1
        )
    `,
    [role, manager, manager, manager]
  )
  console.log(data)
  const [r,m]=data
  if (r.id === null ) {
    console.log("can't find role")
    return
  }
  if (m.id === null ) {
    console.log("can't find manager")
    return
  }
  await db.promise().query('INSERT INTO employee (emp_first_name, emp_last_name, emp_role_id, emp_manager_id) VALUES (?, ?, ?, ?)', [fname, lname, r.id, m.id])
  
}

async function addRole() {
  console.log("addRole init")
  const {roleName, roleSalary, roleDept} = await inquirer.prompt(addEmployeeRole)
  const [ departments ] = await db.promise().query('SELECT id FROM department WHERE dept_name=? OR id=?', [roleDept, roleDept]);
  if (departments.length === 0) {
    console.log("no such department")
    
    return
  } 
  const [department ] = departments
  await db.promise().query('INSERT INTO emp_role (role_title, role_salary, role_dept_id) VALUES (?, ?, ?)', [roleName, roleSalary, department.id])
  console.log("Role has been added");

}


//revisit
async function addDepartments() {
  console.log("addDepartments init")
  const {newDepartment} = await inquirer.
  prompt(addDepartment)
  const [departments ] = await db.promise().query('INSERT INTO department (dept_name) VALUES(?)', [newDepartment]);
};


async function updateEmployee() {
  const [employees] = await db.promise().query(`SELECT employee.id, employee.emp_first_name, employee.emp_last_name from employee`)

  const [roles] = await db.promise().query(`SELECT emp_role.id AS value, emp_role.role_title AS name FROM emp_role`)

  const employeeName = employees.map(employee => ({
    name: `${employee.emp_first_name} ${employee.emp_last_name}`,
    value: employee.id
  }))
  const{employeeId}= await inquirer.prompt({
    type: 'list',
    message: "Select employee you'd like to update",
    choices: employeeName,
    name: "employeeId"
  })
  const{roleId}= await inquirer.prompt({
    type: 'list',
    message: "Select role you'd like to update",
    choices: roles,
    name: "roleId"
  })
  await db.promise().query("UPDATE employee SET emp_role_id=? WHERE id=?", [roleId, employeeId])
  
}

//   let sql1 = `SELECT employee.emp_first_name, employee.emp_last_name from employee`
//   db.query(sql1, (err, rows) => {
//     rows = rows.map( function(employee) {
//       return employee.emp_first_name + " " + employee.emp_last_name
//     })
//     employeeUpdate =
//     {
//       type: 'list',
//       message: "Select employee you'd like to update",
//       choices: rows,
//       name: 'updateEmployee'
//     }
//     inquirer.prompt(updateEmp)
//     return employeeUpdate
//   })

//   let sql2 = `SELECT emp_role.role_title FROM emp_role`
//   db.query(sql2, (err, rows) => {
//     rows = rows.map( function(role) {
//       return role.title
//     })
//     roleUpdate =
//     {
//       type: 'list',
//       message: 'Which role would you like to select?',
//       choices: rows,
//       name: 'updateRole'
//     }
//     inquirer.prompt(roleUpdate)
//     return roleUpdate
//   })
// }


async function init() {
  while(true){
  const {title} = await inquirer.prompt(startQuestions)
 {
      console.log(title);
      if(title === 'view_employees') {
         await viewEmp()
      }
      else if(title === 'view_departments') {
        await viewDepartment()
      }
      else if(title === 'view_roles') {
        await viewRoles()
      }
      else if(title === 'add_employee') {
        await addEmp()
      }
      else if(title === 'add_role') {
        await addRole()
      }
      else if(title === 'add_departments') {
        await addDepartments()
      }
      else if(title === 'update_employee') {
        await updateEmployee()
      }
    }


}}
init()