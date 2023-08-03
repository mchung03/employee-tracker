DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    role_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    job_title VARCHAR(30) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    salary INT NOT NULL
    FOREIGN KEY (department_name)
    REFERENCES departments(name)
    ON DELETE SET NULL
);
