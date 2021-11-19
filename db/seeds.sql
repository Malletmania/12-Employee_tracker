-- revisit
USE employee_bd;

INSERT INTO department (dept_name)
VALUES ('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO emp_role (role_title, role_salary, role_dept_id)
VALUES ('Manager', 100000, 1),
('Salesperson', 90000, 1),
('Software Engineer', 120000, 2),
('Sales Lead', 160000, 3),
('Accountant', 100000, 3),
('Lawyer', 190000, 4),
('Legal Team Lead', 250000, 4),
('Lead Engineer', 150000, 2);

INSERT INTO employee (emp_first_name, emp_last_name, emp_role_id, emp_manager_id)
VALUES ('Jordan', 'Brady', 1, 99)
('Jan', 'Brady', 2, 99),
('Marcia', 'Brady', 3, 99),
('Cindy', 'Brady', 4, 33),
('Greg', 'Brady', 5, 33),
('Carol', 'Brady', 6, 22),
('Bobby', 'Brady', 7, 22),
('Alice', 'Nelson', 8, 33);