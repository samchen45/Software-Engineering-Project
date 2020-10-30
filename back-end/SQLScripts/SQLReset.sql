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
  `uid` BIGINT,
  `fullname` VARCHAR(20) NULL,
  `username` VARCHAR(20) NULL,
  `email` VARCHAR(45) NULL,
  `password` VARCHAR(100) NULL,
  `phonenum` BIGINT(11) NULL,
  `type` VARCHAR(1) NULL,
  PRIMARY KEY (`uid`)
);

/* GENERATE TEST STUDENT */
INSERT INTO users (
  uid, fullname, username, email, password, phonenum, type
)
VALUES (
  10000, 's_fullname', 'student', 'student@test.com', 
  'pbkdf2:sha256:150000$wdaqj561$6c0c7c628b7b6bd0bb4d9b13510ad7a557ee2dd4d44aa40153b82d173372a03c', 
  15011111111, 'S'
);

/* GENERATE TEST TEACHER */
INSERT INTO users (
  uid, fullname, username, email, password, phonenum, type
)
VALUES (
  20000, 't_fullname', 'teacher', 'teacher@test.com', 
  'pbkdf2:sha256:150000$wdaqj561$6c0c7c628b7b6bd0bb4d9b13510ad7a557ee2dd4d44aa40153b82d173372a03c', 
  15022222222, 'T'
);

/* GENERATE TEST ADMINISTRATOR */
INSERT INTO users (
  uid, fullname, username, email, password, phonenum, type
)
VALUES (
  30000, 'a_fullname', 'admin', 'admin@test.com', 
  'pbkdf2:sha256:150000$wdaqj561$6c0c7c628b7b6bd0bb4d9b13510ad7a557ee2dd4d44aa40153b82d173372a03c', 
  11111111111, 'A'
);