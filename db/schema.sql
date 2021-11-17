CREATE DATABASE employee_db;

DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE departments ( 
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
department_name VARCHAR(100) NOT NULL
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL,
    department_id INT
    FOREIGN KEY (department_id)
    REFERENCES(departments(id))
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NO NULL,
    role_id INT,
    manager_id INT 
    FOREIGN KEY (role_id)
    REFERENCES(role(id))
    FOREIGN KEY (manager_id)
    REFERENCES(employee(id));
);


DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE departments ( 
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
department_name VARCHAR(100) NOT NULL
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id)
    REFERENCES roles(id),
    FOREIGN KEY (manager_id)
    REFERENCES employee(id)
);
SELECT * FROM departments
JOIN roles ON departments.id = roles.department_id;

USE employee_db;

INSERT INTO departments (department_name)
VALUES ("engineering"),
("marketing"),
("human resources"),
("accounting");

SELECT * FROM departments;

INSERT INTO employee (first_name, last_name)
VALUES ("emily", "daniel"),
("timothy", "ernst"),
("karl", "thomas");

INSERT INTO roles (title, salary, department_id)
VALUES ("analyst", 60000, 2);

SELECT * FROM roles;

