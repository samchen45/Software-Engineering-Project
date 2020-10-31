/* Create a new rand string as out cid */
use TCPDB;

DELIMITER $$
CREATE DEFINER=`TCPAdmin`@`localhost` FUNCTION `rand_string`(n INT) RETURNS varchar(255) CHARSET latin1
BEGIN
    DECLARE chars_str varchar(100) DEFAULT 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    DECLARE return_str varchar(255) DEFAULT '';
    DECLARE i INT DEFAULT 0;
    WHILE i < n DO
        SET return_str = concat(return_str,substring(chars_str , FLOOR(1 + RAND()*62 ),1));
        SET i = i +1;
    END WHILE;
    RETURN return_str;
END$$
DELIMITER ;