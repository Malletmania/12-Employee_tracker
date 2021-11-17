--department table query
SELECT * FROM departments;

---role table query: role table and role join with department of role query
SELECT * FROM roles;

SELECT * FROM departments
JOIN roles ON departments.id = roles.department_id;

---employee query: employee table, join role id, and department id 
SELECT * FROM employee;

SELECT * FROM roles
JOIN employee ON roles.id = employee.roles_id;

SELECT * FROM employee
JOIN employee ON employee.manager_id = employee.id;