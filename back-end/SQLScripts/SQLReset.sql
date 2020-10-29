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
  `uid` BIGINT AUTO_INCREMENT,
  `fullname` VARCHAR(45) NULL,
  `username` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  `password` VARCHAR(100) NULL,
  `phonenum` VARCHAR(11) NULL,
  `type` VARCHAR(10) NULL,
  PRIMARY KEY (`uid`)
);