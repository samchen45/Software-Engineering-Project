/* DATABASE */
DROP DATABASE IF EXISTS TCPDB;
CREATE DATABASE TCPDB;

/* USER */
DROP USER IF EXISTS 'TCPAdmin'@'localhost';
CREATE USER 'TCPAdmin'@'localhost' IDENTIFIED BY 'password';
GRANT ALL ON TCPDB.* TO 'TCPAdmin'@'localhost';

use TCPDB;

/* USERS TABLES */
DROP TABLE IF EXISTS `TCPDB`.`users`;
CREATE TABLE `TCPDB`.`users` (
  `uid` INT AUTO_INCREMENT,
  `id` VARCHAR(20) NULL,
  `uname` VARCHAR(20) NULL,
  `email` VARCHAR(45) NULL,
  `upassword` VARCHAR(100) NULL,
  `phonenum` VARCHAR(11) NULL,
  `utype` VARCHAR(1) NULL,
  PRIMARY KEY (`uid`),
  UNIQUE (`id`)
);

/* PEOPLE TABLE */
DROP TABLE IF EXISTS `TCPDB`.`people`;
CREATE TABLE `TCPDB`.`people` (
  `id` VARCHAR(20),
  `uname` VARCHAR(20) NULL,
  `utype` VARCHAR(1) NULL,
  PRIMARY KEY (`id`)
);

/* COURSE TABLE */
DROP TABLE IF EXISTS `TCPDB`.`courses`;
CREATE TABLE `TCPDB`.`courses` (
  `cid` INT AUTO_INCREMENT,
  `cname` VARCHAR(20) NULL,
  `ctid` VARCHAR(20) NULL,
  `cdes` VARCHAR(500) NULL,
  `ctextbook` VARCHAR(100) NULL,
  PRIMARY KEY (`cid`)
);

/* ROSTER TABLE */
DROP TABLE IF EXISTS `TCPDB`.`rosters`;
CREATE TABLE `TCPDB`.`rosters` (
  `cid` INT NOT NULL,
  `sid` VARCHAR(20) NOT NULL,
  FOREIGN KEY (`cid`) REFERENCES courses(`cid`) ON DELETE CASCADE,
  FOREIGN KEY (`sid`) REFERENCES users(`id`) ON DELETE CASCADE
);

/* OLD ROSTER TABLE */
DROP TABLE IF EXISTS `TCPDB`.`pastrosters`;
CREATE TABLE `TCPDB`.`pastrosters` (
  `cid` INT NOT NULL,
  `sid` VARCHAR(20) NOT NULL,
  FOREIGN KEY (`cid`) REFERENCES courses(`cid`) ON DELETE CASCADE,
  FOREIGN KEY (`sid`) REFERENCES users(`id`) ON DELETE CASCADE
);

/* HOMEWORK TABLE */
DROP TABLE IF EXISTS `TCPDB`.`homeworks`;
CREATE TABLE `TCPDB`.`homeworks` (
  `cid` INT NOT NULL,
  `hid` VARCHAR(20) NOT NULL,
  `hname` VARCHAR(20) NULL,
  `hdes` VARCHAR(500) NULL,
  PRIMARY KEY (`cid`, `hid`)
);

/* SUBMIT HOMEWORK TABLE */
DROP TABLE IF EXISTS `TCPDB`.`submit`;
CREATE TABLE `TCPDB`.`submit` (
  `hid` VARCHAR(20) NOT NULL,
  `uid` VARCHAR(20) NOT NULL,
  `hurl` VARCHAR(100) NULL,
  `hstatus` BOOLEAN DEFAULT FALSE,
  `score` DOUBLE(5,2),
  PRIMARY KEY (`hid`, `uid`)
);

/* GENERATE TEST STUDENT */
INSERT INTO users (
  id, uname, email, upassword, phonenum, utype
)
VALUES (
  10000, 'student', 'student@test.com', 
  'pbkdf2:sha256:150000$wdaqj561$6c0c7c628b7b6bd0bb4d9b13510ad7a557ee2dd4d44aa40153b82d173372a03c', 
  15011111111, 'S'
), (
  10001, 'student1', 'student1@test.com', 
  'pbkdf2:sha256:150000$wdaqj561$6c0c7c628b7b6bd0bb4d9b13510ad7a557ee2dd4d44aa40153b82d173372a03c', 
  15011111111, 'S'
), (
  10002, 'student2', 'student2@test.com', 
  'pbkdf2:sha256:150000$wdaqj561$6c0c7c628b7b6bd0bb4d9b13510ad7a557ee2dd4d44aa40153b82d173372a03c', 
  15011111111, 'S'
);

/* GENERATE TEST TEACHER */
INSERT INTO users (
  id, uname, email, upassword, phonenum, utype
)
VALUES (
  20000, 'teacher', 'teacher@test.com', 
  'pbkdf2:sha256:150000$wdaqj561$6c0c7c628b7b6bd0bb4d9b13510ad7a557ee2dd4d44aa40153b82d173372a03c', 
  15022222222, 'T'
);

/* GENERATE TEST ADMINISTRATOR */
INSERT INTO users (
  id, uname, email, upassword, phonenum, utype
)
VALUES (
  30000, 'admin', 'admin@test.com', 
  'pbkdf2:sha256:150000$wdaqj561$6c0c7c628b7b6bd0bb4d9b13510ad7a557ee2dd4d44aa40153b82d173372a03c', 
  11111111111, 'A'
);

/* GENERATE TEST PEOPLE TABLE */
INSERT INTO people (id, uname, utype) VALUES (10000, 'student', 'S');
INSERT INTO people (id, uname, utype) VALUES (20000, 'teacher', 'T');
INSERT INTO people (id, uname, utype) VALUES (30000, 'admin', 'A');
INSERT INTO people (id, uname, utype) VALUES (10001, 'student1', 'S');
INSERT INTO people (id, uname, utype) VALUES (10002, 'student2', 'S');
INSERT INTO people (id, uname, utype) VALUES (10003, 'student3', 'S');
INSERT INTO people (id, uname, utype) VALUES (20001, 'teacher1', 'T');
INSERT INTO people (id, uname, utype) VALUES (20002, 'teacher2', 'T');
INSERT INTO people (id, uname, utype) VALUES (20003, 'teacher3', 'T');

/* GENERATE TEST COURSE */
/* source ./f_createRandomCid.sql; */

INSERT INTO courses (cname, ctid, cdes, ctextbook) VALUES (
  'math', '20001', 'math course description', 'math course textbook'
), (
  'english', '20002', 'english course desciption', 'english course textbook'
);

/* GENERATE TEST HOMEWORK */
INSERT INTO homeworks (
  cid, hid, hname, hdes
)
VALUES (
  1, 'math1', 'calculation', 
  'math homework1'
);

INSERT INTO homeworks (
  cid, hid, hname, hdes
)
VALUES (
  2, 'english1', 'pronunciation', 
  'english homework1'
);

/* GENERATE TEST SUBMIT */
INSERT INTO submit (
  hid, uid, hurl, hstatus, score
)
VALUES (
  'math1', '10000', 'homework/abc101/math1/10000/', 
  TRUE, 90.000001
);

/* GENERATE TEST ROSTERS */
INSERT INTO rosters (cid, sid) VALUES (1, '10000'), (1, '10001'), (2, '20000');
/* GENERATE OLD ROSTER */
INSERT INTO pastrosters (cid, sid) VALUES (2, '10000'), (2, '10001'), (1, '20000');
