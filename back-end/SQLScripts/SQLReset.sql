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
  `uid` INT AUTO_INCREMENT, /* 好像真没什么用 --psy */
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

-- /* COURSE TABLE */
-- DROP TABLE IF EXISTS `TCPDB`.`courses`;
-- CREATE TABLE `TCPDB`.`courses` (
--   `cid` INT AUTO_INCREMENT,
--   `cname` VARCHAR(20) NULL,
--   `ctid` VARCHAR(20) NULL,
--   `cdes` VARCHAR(500) NULL,
--   `ctextbook` VARCHAR(100) NULL,
--   PRIMARY KEY (`cid`)
-- );


-- /* OLD ROSTER TABLE */
-- DROP TABLE IF EXISTS `TCPDB`.`pastrosters`;
-- CREATE TABLE `TCPDB`.`pastrosters` (
--   `cid` INT NOT NULL,
--   `sid` VARCHAR(20) NOT NULL,
--   FOREIGN KEY (`cid`) REFERENCES courses(`cid`) ON DELETE CASCADE,
--   FOREIGN KEY (`sid`) REFERENCES users(`id`) ON DELETE CASCADE
-- );

-- /* HOMEWORK TABLE */
-- DROP TABLE IF EXISTS `TCPDB`.`homeworks`;
-- CREATE TABLE `TCPDB`.`homeworks` (
--   `cid` INT NOT NULL,
--   `hid` INT NOT NULL AUTO_INCREMENT,
--   `hname` VARCHAR(20) NULL,
--   `hdes` VARCHAR(500) NULL,
--   `hdate` DATE NULL,
--   `hanswer` VARCHAR(500) NULL,
--   PRIMARY KEY (`hid`)
-- );

-- /* SUBMIT HOMEWORK TABLE */
-- DROP TABLE IF EXISTS `TCPDB`.`submit`;
-- CREATE TABLE `TCPDB`.`submit` (
--   `hid` VARCHAR(20) NOT NULL,
--   `uid` VARCHAR(20) NOT NULL,
--   `hurl` VARCHAR(1000) NULL,
--   `hstatus` enum('N', 'Y', 'E') DEFAULT 'N',  -- N: not submit yet; Y: submitted already; E: submitted overtime;
--   `score` DOUBLE(5,2),
--   PRIMARY KEY (`hid`, `uid`)
-- );

/* LAB TABLE */
DROP TABLE IF EXISTS `TCPDB`.`labs`;
CREATE TABLE `TCPDB`.`labs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20) NULL,
  `aim` VARCHAR(500) NULL,
  -- `date` DATE NULL,
  -- `tid` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`)
);


-- /* ROSTER TABLE */
-- DROP TABLE IF EXISTS `TCPDB`.`rosters`;
-- CREATE TABLE `TCPDB`.`rosters` (
--   `labid` INT NOT NULL,
--   `sid` VARCHAR(20) NOT NULL,
--   FOREIGN KEY (`labid`) REFERENCES labs(`id`) ON DELETE CASCADE,
--   FOREIGN KEY (`sid`) REFERENCES users(`id`) ON DELETE CASCADE
-- );

-- /* SUBMIT LAB REPORT TABLE */
-- DROP TABLE IF EXISTS `TCPDB`.`reports`;
-- CREATE TABLE `TCPDB`.`reports` (
--   `labid` INT NOT NULL,
--   `labname` VARCHAR(20) NULL,
--   `labaim` VARCHAR(500) NULL,
--   `uid` VARCHAR(20) NOT NULL,
--   `uname` VARCHAR(20) NULL,
--   `stucomment` VARCHAR(1000) NULL,
--   `teacomment` VARCHAR(1000) NULL,
--   `attachment` VARCHAR(100) NULL,
--   `signature` VARCHAR(100) NULL,
--   `status` enum('N', 'Y', 'E') DEFAULT 'N',  -- N: not submit yet; Y: submitted already; E: submitted overtime;
--   `score` DOUBLE(5, 2) DEFAULT 0.0,
--   FOREIGN KEY (`labid`) REFERENCES labs(`id`) ON DELETE CASCADE,
--   PRIMARY KEY (`labid`, `uid`)
-- );

/* LAB REPORTS TABLE */
DROP TABLE IF EXISTS `TCPDB`.`reports`;
CREATE TABLE `TCPDB`.`reports` (
  `labname` VARCHAR(50) NOT NULL,
  `labgoal` VARCHAR(500) NULL,
  `sid` VARCHAR(20) NOT NULL,
  `score` FLOAT DEFAULT 0.0,
  `method` VARCHAR(500) NULL,
  `review` VARCHAR(500) NULL,
  FOREIGN KEY (`sid`) REFERENCES users(`id`) ON DELETE CASCADE,
  PRIMARY KEY (`sid`, `labname`)
);

/* REPORT PICTURES TABLE */
DROP TABLE IF EXISTS `TCPDB`.`pictures`;
CREATE TABLE `TCPDB`.`pictures` (
  `filename` VARCHAR(100) NOT NULL,
  `des` VARCHAR(500) NULL,
  PRIMARY KEY (`filename`)
);

/* DISCUSSION POSTS */
DROP TABLE IF EXISTS `TCPDB`.`dis_posts`;
CREATE TABLE `TCPDB`.`dis_posts` (
  `id` INT AUTO_INCREMENT,
  `labid` INT NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `text` VARCHAR(500) NOT NULL,
  `owner` VARCHAR(20) NOT NULL,
  `time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`owner`) REFERENCES users(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`labid`) REFERENCES labs(`id`) ON DELETE CASCADE,
  PRIMARY KEY (`id`)
);

/* DISCUSSION REPLIES */
DROP TABLE IF EXISTS `TCPDB`.`dis_replies`;
CREATE TABLE `TCPDB`.`dis_replies` (
  `id` INT AUTO_INCREMENT,
  `postid` INT NOT NULL,
  `owner` VARCHAR(20) NOT NULL,
  `time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `text` VARCHAR(500) NOT NULL,
  `quote` INT NULL,
  FOREIGN KEY (`owner`) REFERENCES users(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`postid`) REFERENCES dis_posts(`id`) ON DELETE CASCADE,
  PRIMARY KEY (`id`)
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
), (
  20001, 'teacher1', 'teacher1@test.com', 
  'pbkdf2:sha256:150000$wdaqj561$6c0c7c628b7b6bd0bb4d9b13510ad7a557ee2dd4d44aa40153b82d173372a03c', 
  15022222222, 'T'
), (
  20002, 'teacher2', 'teacher2@test.com', 
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

-- INSERT INTO courses (cname, ctid, cdes, ctextbook) VALUES (
--   'math', '20000', 'math course description', 'math course textbook'
-- ), (
--   'english', '20002', 'english course desciption', 'english course textbook'
-- ), (
--   'course1', '20001', 'course1 description', 'course1 textbook'
-- ), (
--   'course2', '20002', 'course2 description', 'course2 textbook'
-- ), (
--   'course3', '20001', 'course3 description', 'course3 textbook'
-- ), (
--   'course4', '20001', 'course4 description', 'course4 textbook'
-- ), (
--   'course5', '20002', 'course5 description', 'course5 textbook'
-- );

-- /* GENERATE TEST HOMEWORK */
-- INSERT INTO homeworks (
--   cid, hname, hdes, hdate
-- )
-- VALUES (
--   1, 'calculation', 
--   'math homework1', '2020-10-01'
-- );

-- INSERT INTO homeworks (
--   cid, hname, hdes, hdate
-- )
-- VALUES (
--   2, 'pronunciation', 
--   'english homework1', '2021-01-01'
-- );

/* GENERATE TEST LAB */
INSERT INTO labs (
  name, aim
) VALUES (
  'physics', 'physical study'
), (
  'chemistry', 'chemical study'
);

-- /* GENERATE TEST SUBMIT */
-- INSERT INTO submit (
--   hid, uid, hurl, hstatus, score
-- )
-- VALUES (
--   '1', '10000', 'homework/1/1/10000/',  -- filename: homework/cid/hid/id
--   'Y', 90.000001
-- );

-- /* GENERATE TEST SUBMIT LAB REPORT */
-- INSERT INTO reports (
--   labid, labname, labaim, uid, uname, stucomment, teacomment, attachment, signature, score
-- )
-- VALUES (
--   '1', 'physics', '提高学生动手能力', '10001', 'student1', '', '做得好', '附件', '电子签名',  -- filename: homework/cid/hid/id
--   90.01
-- ), (
--   '2', 'chemistry', '提高学生动手能力', '10002', 'student2', '', '做得好', '附件', '电子签名',  -- filename: homework/cid/hid/id
--   90.01
-- ), (
--   '1', 'physics', '提高学生动手能力', '10002', 'student2', '非常难', '做得好', '附件', '电子签名',  -- filename: homework/cid/hid/id
--   90.01
-- ), (
--   '2', 'chemistry', '提高学生动手能力', '10001', 'student1', '', '做得好', '附件', '电子签名',  -- filename: homework/cid/hid/id
--   90.01
-- );

/* GENERATE TEST SUBMIT LAB REPORT */
INSERT INTO reports (
  labname, labgoal, sid, score, method, review
)
VALUES (
  'test_labname_1', 'test_labgoal_1', '10001', 91.1, 'test method 1', 'test review 1'
), (
  'test_labname_2', 'test_labgoal_2', '10002', 81.2, 'test method 2', 'test review 2'
);

/* GENERATE TEST POSTS */
INSERT INTO dis_posts (
  labid, title, text, owner, time
)
VALUES (
  1, 'physics_post_test', 'texttest', '10001', CURRENT_TIMESTAMP
), (
  1, 'physics_post_test', 'texttest', '10001', CURRENT_TIMESTAMP
), (
  2, 'chem_post_test', 'texttest', '10001', CURRENT_TIMESTAMP
), (
  2, 'chem_post_test', 'texttest', '10001', CURRENT_TIMESTAMP
);

/* GENERATE TEST REPLIES */
INSERT INTO dis_replies (
  postid, owner, time, text, quote
)
VALUES (
  1, '10001','2021-01-01 20:21:01', '1st floor,  沙发', NULL
), (
  1, '20000','2021-01-02 00:53:03', '2nd floor, teacher', NULL
), (
  1, '10000','2021-01-04 18:19:01', '3rd floor, 笑摸一楼狗头', 1
), (
  2, '10001','2021-01-06 12:45:32', '1st floor', NULL
);

/* GENERATE TEST ROSTERS */
-- INSERT INTO rosters (labid, sid) VALUES (1, '10000'), (1, '10001'), (1, '10002'), (2, '10000'), (2, '10001'), (2, '10002');
-- /* GENERATE OLD ROSTER */
-- INSERT INTO pastrosters (cid, sid) VALUES (7, '10000'), (7, '10001'), (7, '10002'), (4, '10002'), (5, '10001'), (4, '10000');
