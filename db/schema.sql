DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

use employee_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(30) NOT NULL
);

CREATE TABLE emp_role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    role_title VARCHAR(30) NOT NULL,
    role_salary DECIMAL NOT NULL,
    role_dept_id INT,
    FOREIGN KEY (role_dept_id) REFERENCES department(id) ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    emp_first_name VARCHAR(30) NOT NULL,
    emp_last_name VARCHAR(30) NOT NULL,
    emp_role_id INT,
    emp_manager_id INT,
    FOREIGN KEY (emp_role_id) REFERENCES emp_role(id) ON DELETE SET NULL
);