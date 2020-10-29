use BucketList;
DROP TABLE IF EXISTS `BucketList'`.`users`;
CREATE TABLE `BucketList`.`users` (
     username VARCHAR(20) NOT NULL, 
     fullname VARCHAR(40) NOT NULL, 
     PRIMARY KEY(username) );

DROP TABLE IF EXISTS `BucketList`.`tbl_user`;
CREATE TABLE `BucketList`.`tbl_user` (
  `user_id` BIGINT AUTO_INCREMENT,
  `user_name` VARCHAR(45) NULL,
  `user_username` VARCHAR(45) NULL,
  `user_password` VARCHAR(100) NULL,
  PRIMARY KEY (`user_id`));
