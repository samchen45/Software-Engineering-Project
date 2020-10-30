/* DATABASE */
DROP DATABASE IF EXISTS TCPDB;
CREATE DATABASE TCPDB;

/* USER */
DROP USER IF EXISTS 'TCPAdmin'@'localhost';
CREATE USER 'TCPAdmin'@'localhost' IDENTIFIED BY 'password';
GRANT ALL ON TCPDB.* TO 'TCPAdmin'@'localhost';

use TCPDB;
/* TABLES */
DROP TABLE IF EXISTS `TCPDB`.`users`;
CREATE TABLE `TCPDB`.`users` (
  `uid` INT AUTO_INCREMENT,
  `id` VARCHAR(20) NULL,
  `name` VARCHAR(20) NULL,
  `email` VARCHAR(45) NULL,
  `password` VARCHAR(100) NULL,
  `phonenum` VARCHAR(11) NULL,
  `type` VARCHAR(1) NULL,
  PRIMARY KEY (`uid`)
);

DROP TABLE IF EXISTS `TCPDB`.`people`;
CREATE TABLE `TCPDB`.`people` (
  `id` VARCHAR(20),
  `name` VARCHAR(20) NULL,
  `type` VARCHAR(1) NULL,
  PRIMARY KEY (`id`)
);

/* GENERATE TEST STUDENT */
INSERT INTO users (
  id, name, email, password, phonenum, type
)
VALUES (
  10000, 'student', 'student@test.com', 
  'pbkdf2:sha256:150000$wdaqj561$6c0c7c628b7b6bd0bb4d9b13510ad7a557ee2dd4d44aa40153b82d173372a03c', 
  15011111111, 'S'
);

/* GENERATE TEST TEACHER */
INSERT INTO users (
  id, name, email, password, phonenum, type
)
VALUES (
  20000, 'teacher', 'teacher@test.com', 
  'pbkdf2:sha256:150000$wdaqj561$6c0c7c628b7b6bd0bb4d9b13510ad7a557ee2dd4d44aa40153b82d173372a03c', 
  15022222222, 'T'
);

/* GENERATE TEST ADMINISTRATOR */
INSERT INTO users (
  id, name, email, password, phonenum, type
)
VALUES (
  30000, 'admin', 'admin@test.com', 
  'pbkdf2:sha256:150000$wdaqj561$6c0c7c628b7b6bd0bb4d9b13510ad7a557ee2dd4d44aa40153b82d173372a03c', 
  11111111111, 'A'
);

/* GENERATE TEST PEOPLE TABLE */
INSERT INTO people (id, name, type) VALUES (10000, 'student', 'S');
INSERT INTO people (id, name, type) VALUES (20000, 'teacher', 'T');
INSERT INTO people (id, name, type) VALUES (30000, 'admin', 'A');
INSERT INTO people (id, name, type) VALUES (10001, 'student1', 'S');
INSERT INTO people (id, name, type) VALUES (10002, 'student2', 'S');
INSERT INTO people (id, name, type) VALUES (10003, 'student3', 'S');
INSERT INTO people (id, name, type) VALUES (20001, 'teacher1', 'T');
INSERT INTO people (id, name, type) VALUES (20002, 'teacher2', 'T');
INSERT INTO people (id, name, type) VALUES (20003, 'teacher3', 'T');