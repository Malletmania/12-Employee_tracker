DROP DATABASE IF EXISTS employee_bd;
CREATE DATABASE employee_bd;

use employee_bd;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(30) NOT NULL
);

CREATE TABLE emp_role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    role_title VARCHAR(30) NOT NULL,
    role_salary DECIMAL NOT NULL,
    role_dept_id INT,
    FOREIGN KEY (role_dept_id) REFERANCES department(id) ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    emp_first_name VARCHAR(30) NOT NULL,
    emp_last_name VARCHAR(30) NOT NULL,
    emp_role_id INT,
    emp_manager_id INT,
    FOREIGN KEY (emp_role_id) REFERANCES emp_role(id) ON DELETE SET NULL
);